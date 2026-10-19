import { supabase } from '../lib/supabase';

export const STORAGE_BUCKET_PORTFOLIO = 'portfolio-media';
export const STORAGE_BUCKET_BEFORE_AFTER = 'before-after-media';

// Maximum size limits in bytes
export const MAX_VIDEO_SIZE_BYTES = 500 * 1024 * 1024; // 500 MB
export const MAX_IMAGE_SIZE_BYTES = 50 * 1024 * 1024;  // 50 MB

const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/ogg'];
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
}

/**
 * Capture a frame from an uploaded video file to use as its thumbnail poster.
 */
export async function captureVideoThumbnail(videoFile: File): Promise<Blob | null> {
  return new Promise((resolve) => {
    try {
      const video = document.createElement('video');
      const url = URL.createObjectURL(videoFile);
      video.src = url;
      video.muted = true;
      video.playsInline = true;
      video.crossOrigin = 'anonymous';
      video.currentTime = 0.5;

      const cleanup = () => {
        URL.revokeObjectURL(url);
        video.remove();
      };

      const timer = setTimeout(() => {
        cleanup();
        resolve(null);
      }, 5000);

      video.onloadeddata = () => {
        video.currentTime = Math.min(0.5, (video.duration || 1) / 2);
      };

      video.onseeked = () => {
        clearTimeout(timer);
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 1280;
          canvas.height = video.videoHeight || 720;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(
              (blob) => {
                cleanup();
                resolve(blob);
              },
              'image/jpeg',
              0.88
            );
          } else {
            cleanup();
            resolve(null);
          }
        } catch {
          cleanup();
          resolve(null);
        }
      };

      video.onerror = () => {
        clearTimeout(timer);
        cleanup();
        resolve(null);
      };
    } catch {
      resolve(null);
    }
  });
}

/**
 * Creates a fallback SVG poster blob when frame extraction isn't available.
 */
export function generateFallbackPoster(title: string): Blob {
  const cleanTitle = title.replace(/[<>&'"]/g, '');
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
      <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="#14141e"/>
          <stop offset="100%" stop-color="#050508"/>
        </radialGradient>
        <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f5e08b"/>
          <stop offset="100%" stop-color="#d4af37"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <circle cx="640" cy="360" r="280" fill="none" stroke="rgba(212,175,55,0.12)" stroke-width="2"/>
      <circle cx="640" cy="360" r="56" fill="rgba(212,175,55,0.15)" stroke="url(#gold)" stroke-width="2"/>
      <polygon points="632,342 658,360 632,378" fill="url(#gold)"/>
      <text x="640" y="460" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="1">
        ${cleanTitle || 'RYNX MASTER'}
      </text>
      <text x="640" y="495" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#a0a0b0" text-anchor="middle" letter-spacing="3">
        CINEMATIC PRODUCTION
      </text>
    </svg>
  `.trim();

  return new Blob([svg], { type: 'image/svg+xml' });
}

/**
 * Uploads a file/blob to Supabase Storage with accurate progress tracking.
 */
async function uploadWithProgress(
  bucket: string,
  path: string,
  file: Blob | File,
  contentType: string,
  onProgress?: (pct: number) => void
): Promise<{ path: string; publicUrl: string }> {
  if (onProgress) onProgress(5);

  // Use standard Supabase Storage upload
  const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
    contentType,
    cacheControl: '31536000',
    upsert: false,
  });

  if (uploadError) {
    if (uploadError.message?.includes('violates row-level security policy') || (uploadError as { statusCode?: string }).statusCode === '403') {
      throw new Error(
        `Storage Upload Denied: Storage bucket "${bucket}" or its RLS policies must be created in Supabase SQL editor. Please apply the migration supabase/migrations/20261019_media_uploads.sql.`
      );
    }
    if (uploadError.message?.toLowerCase().includes('exceeded the maximum allowed size')) {
      throw new Error(
        `File size exceeds Supabase Storage limits. Supabase Free tier enforces a 50MB limit per file. To resolve this: (1) Export or compress your video to under 50MB (e.g. 1080p web MP4 at 12-15Mbps), or (2) Run this SQL in your Supabase SQL editor if your plan permits: UPDATE storage.buckets SET file_size_limit = 524288000 WHERE id = '${bucket}';`
      );
    }
    throw new Error(`Upload to ${bucket} failed: ${uploadError.message}`);
  }

  if (onProgress) onProgress(100);

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);

  return {
    path,
    publicUrl: urlData.publicUrl,
  };
}

export const storageService = {
  /**
   * Uploads an admin-selected portfolio video file, tracks upload progress,
   * captures a high quality thumbnail frame automatically, and returns paths and URLs.
   */
  async uploadPortfolioVideo(
    file: File,
    title: string,
    onProgress?: (pct: number) => void
  ): Promise<{
    videoPath: string;
    videoUrl: string;
    thumbnailPath: string;
    thumbnailUrl: string;
  }> {
    if (!ALLOWED_VIDEO_TYPES.includes(file.type) && !file.name.match(/\.(mp4|webm|mov|m4v)$/i)) {
      throw new Error(
        `Unsupported video format (${file.type || file.name}). Please select an MP4, WebM, or MOV video file.`
      );
    }

    if (file.size > MAX_VIDEO_SIZE_BYTES) {
      throw new Error(
        `Video size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the maximum allowed limit of 500MB.`
      );
    }

    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const videoPath = `videos/${uniqueId}-${sanitizeFilename(file.name)}`;

    // 1. Upload Video (progress 0% -> 80%)
    const videoResult = await uploadWithProgress(
      STORAGE_BUCKET_PORTFOLIO,
      videoPath,
      file,
      file.type || 'video/mp4',
      (pct) => {
        if (onProgress) onProgress(Math.round(pct * 0.8));
      }
    );

    // 2. Generate and upload thumbnail (progress 80% -> 100%)
    let thumbnailBlob: Blob | null = null;
    try {
      thumbnailBlob = await captureVideoThumbnail(file);
    } catch {
      thumbnailBlob = null;
    }

    if (!thumbnailBlob) {
      thumbnailBlob = generateFallbackPoster(title);
    }

    const thumbPath = `thumbnails/${uniqueId}-poster.jpg`;
    const thumbResult = await uploadWithProgress(
      STORAGE_BUCKET_PORTFOLIO,
      thumbPath,
      thumbnailBlob,
      'image/jpeg',
      (pct) => {
        if (onProgress) onProgress(80 + Math.round(pct * 0.2));
      }
    );

    return {
      videoPath: videoResult.path,
      videoUrl: videoResult.publicUrl,
      thumbnailPath: thumbResult.path,
      thumbnailUrl: thumbResult.publicUrl,
    };
  },

  /**
   * Uploads a Before or After comparison image.
   */
  async uploadBeforeAfterImage(
    file: File,
    type: 'before' | 'after',
    onProgress?: (pct: number) => void
  ): Promise<{ imagePath: string; imageUrl: string }> {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type) && !file.name.match(/\.(jpe?g|png|webp|avif)$/i)) {
      throw new Error(
        `Unsupported image format (${file.type || file.name}). Please select a JPEG, PNG, or WebP image.`
      );
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      throw new Error(
        `Image size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the maximum limit of 50MB.`
      );
    }

    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const imagePath = `comparisons/${uniqueId}-${type}-${sanitizeFilename(file.name)}`;

    const result = await uploadWithProgress(
      STORAGE_BUCKET_BEFORE_AFTER,
      imagePath,
      file,
      file.type || 'image/jpeg',
      onProgress
    );

    return {
      imagePath: result.path,
      imageUrl: result.publicUrl,
    };
  },

  /**
   * Safely deletes a file from Supabase Storage without throwing if it doesn't exist.
   */
  async deleteFile(bucket: string, path?: string | null): Promise<void> {
    if (!path) return;
    try {
      await supabase.storage.from(bucket).remove([path]);
    } catch (err) {
      console.warn(`Storage delete cleanup warning (${bucket}/${path}):`, err);
    }
  },

  getPublicUrl(bucket: string, path: string): string {
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  },
};

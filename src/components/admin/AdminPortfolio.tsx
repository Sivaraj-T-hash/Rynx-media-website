import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Film,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
  Upload,
  RefreshCw,
  FileVideo,
} from 'lucide-react';
import type { DbPortfolioProject, Category } from '../../types/database';
import { portfolioService } from '../../services/portfolioService';
import { categoriesService } from '../../services/categoriesService';
import { storageService, STORAGE_BUCKET_PORTFOLIO } from '../../services/storageService';

export const AdminPortfolio: React.FC = () => {
  const [projects, setProjects] = useState<DbPortfolioProject[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<DbPortfolioProject | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '2.39:1'>('16:9');
  const [duration, setDuration] = useState('00:30');
  const [clientIndustry, setClientIndustry] = useState('');
  const [deliverablesStr, setDeliverablesStr] = useState('');
  const [toolsStr, setToolsStr] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [displayOrder, setDisplayOrder] = useState('0');

  // Video File Upload State
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [existingVideoUrl, setExistingVideoUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [useExternalLink, setUseExternalLink] = useState(false);
  const [externalVideoUrl, setExternalVideoUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [projs, cats] = await Promise.all([
        portfolioService.getAllProjectsAdmin(),
        categoriesService.getCategories(),
      ]);
      setProjects(projs);
      setCategories(cats);
    } catch (err: unknown) {
      console.warn('Error loading admin portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Cleanup object URLs on unmount or file change
  useEffect(() => {
    return () => {
      if (videoPreviewUrl && videoPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [videoPreviewUrl]);

  const openAddModal = () => {
    setEditingProject(null);
    setTitle('');
    setSlug('');
    setDescription('');
    setCategoryId(categories[0]?.id || '');
    setAspectRatio('16:9');
    setDuration('00:30');
    setClientIndustry('');
    setDeliverablesStr('4K UHD Master, Social Cutdowns');
    setToolsStr('Premiere Pro, DaVinci Resolve, After Effects');
    setIsFeatured(false);
    setIsPublished(true);
    setDisplayOrder('0');

    setVideoFile(null);
    if (videoPreviewUrl && videoPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    setVideoPreviewUrl(null);
    setExistingVideoUrl(null);
    setUseExternalLink(false);
    setExternalVideoUrl('');
    setUploadProgress(0);
    setIsUploading(false);

    setErrorMsg(null);
    setSuccessMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (proj: DbPortfolioProject) => {
    setEditingProject(proj);
    setTitle(proj.title);
    setSlug(proj.slug);
    setDescription(proj.description);
    setCategoryId(proj.category_id || '');
    setAspectRatio(proj.aspect_ratio || '16:9');
    setDuration(proj.duration || '00:30');
    setClientIndustry(proj.client_industry || '');
    setDeliverablesStr((proj.deliverables || []).join(', '));
    setToolsStr((proj.tools_used || []).join(', '));
    setIsFeatured(proj.is_featured);
    setIsPublished(proj.is_published);
    setDisplayOrder(String(proj.display_order));

    setVideoFile(null);
    if (videoPreviewUrl && videoPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    setVideoPreviewUrl(null);
    setExistingVideoUrl(proj.full_video_url || proj.preview_video_url || null);
    setUseExternalLink(Boolean(!proj.video_storage_path && proj.full_video_url));
    setExternalVideoUrl(proj.video_storage_path ? '' : (proj.full_video_url || ''));
    setUploadProgress(0);
    setIsUploading(false);

    setErrorMsg(null);
    setSuccessMsg(null);
    setIsModalOpen(true);
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|webm|mov|m4v)$/i)) {
      setErrorMsg('Invalid video format. Please upload an MP4, WebM, or MOV file.');
      return;
    }

    // Validate size (500MB limit)
    if (file.size > 500 * 1024 * 1024) {
      setErrorMsg(`File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 500MB limit.`);
      return;
    }

    setErrorMsg(null);
    setVideoFile(file);

    // Create local object URL for instant preview before upload
    if (videoPreviewUrl && videoPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    const blobUrl = URL.createObjectURL(file);
    setVideoPreviewUrl(blobUrl);
  };

  const handleTogglePublish = async (proj: DbPortfolioProject) => {
    try {
      await portfolioService.updateProject(proj.id, {
        is_published: !proj.is_published,
      });
      await loadAll();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Publish toggle failed.';
      alert(msg);
    }
  };

  const handleDelete = async (proj: DbPortfolioProject) => {
    if (!window.confirm(`Are you sure you want to delete "${proj.title}"? This will also remove the uploaded video from storage.`)) {
      return;
    }

    try {
      await portfolioService.deleteProject(proj.id);
      await loadAll();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed.';
      alert(msg);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!title.trim()) {
      setErrorMsg('Project title is required.');
      return;
    }
    if (!slug.trim()) {
      setErrorMsg('Project slug is required.');
      return;
    }
    if (!editingProject && !videoFile && (!useExternalLink || !externalVideoUrl.trim())) {
      setErrorMsg('Project Video is required. Please select an MP4, WebM, or MOV file, or provide an external video link.');
      return;
    }

    const deliverables = deliverablesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const toolsUsed = toolsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    setSubmitting(true);

    let newlyUploadedVideoPath: string | null = null;
    let newlyUploadedThumbPath: string | null = null;

    try {
      let finalFullVideoUrl = existingVideoUrl || '';
      let finalVideoStoragePath = editingProject?.video_storage_path || null;
      let finalThumbnailUrl = editingProject?.thumbnail_url || '';
      let finalThumbnailStoragePath = editingProject?.thumbnail_storage_path || null;

      // 1. Upload Video if a new file was chosen and not using external link
      if (videoFile && !useExternalLink) {
        setIsUploading(true);
        setUploadProgress(0);

        const uploadResult = await storageService.uploadPortfolioVideo(
          videoFile,
          title.trim(),
          (pct) => setUploadProgress(pct)
        );

        newlyUploadedVideoPath = uploadResult.videoPath;
        newlyUploadedThumbPath = uploadResult.thumbnailPath;

        finalFullVideoUrl = uploadResult.videoUrl;
        finalVideoStoragePath = uploadResult.videoPath;
        finalThumbnailUrl = uploadResult.thumbnailUrl;
        finalThumbnailStoragePath = uploadResult.thumbnailPath;
      } else if (useExternalLink && externalVideoUrl.trim()) {
        finalFullVideoUrl = externalVideoUrl.trim();
        finalVideoStoragePath = null;
        if (!finalThumbnailUrl) {
          finalThumbnailUrl = `https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1280&q=80`;
        }
      }

      // 2. Insert or update in database
      if (editingProject) {
        const previousVideoStoragePath = editingProject.video_storage_path;
        const previousThumbStoragePath = editingProject.thumbnail_storage_path;

        await portfolioService.updateProject(editingProject.id, {
          title: title.trim(),
          slug: slug.trim().toLowerCase(),
          description: description.trim(),
          category_id: categoryId || null,
          thumbnail_url: finalThumbnailUrl,
          thumbnail_storage_path: finalThumbnailStoragePath,
          preview_video_url: finalFullVideoUrl,
          full_video_url: finalFullVideoUrl,
          video_storage_path: finalVideoStoragePath,
          aspect_ratio: aspectRatio,
          duration: duration.trim() || '00:30',
          client_industry: clientIndustry.trim() || null,
          deliverables,
          tools_used: toolsUsed,
          is_featured: isFeatured,
          is_published: isPublished,
          display_order: Number(displayOrder) || 0,
        });

        // 3. Clean up old video files only after DB update succeeded
        if (videoFile && previousVideoStoragePath && previousVideoStoragePath !== finalVideoStoragePath) {
          await storageService.deleteFile(STORAGE_BUCKET_PORTFOLIO, previousVideoStoragePath);
        }
        if (videoFile && previousThumbStoragePath && previousThumbStoragePath !== finalThumbnailStoragePath) {
          await storageService.deleteFile(STORAGE_BUCKET_PORTFOLIO, previousThumbStoragePath);
        }

        setSuccessMsg('Project updated successfully.');
      } else {
        await portfolioService.createProject({
          title: title.trim(),
          slug: slug.trim().toLowerCase(),
          description: description.trim(),
          category_id: categoryId || null,
          thumbnail_url: finalThumbnailUrl,
          thumbnail_storage_path: finalThumbnailStoragePath,
          preview_video_url: finalFullVideoUrl,
          full_video_url: finalFullVideoUrl,
          video_storage_path: finalVideoStoragePath,
          aspect_ratio: aspectRatio,
          duration: duration.trim() || '00:30',
          client_industry: clientIndustry.trim() || null,
          deliverables,
          tools_used: toolsUsed,
          is_featured: isFeatured,
          is_published: isPublished,
          display_order: Number(displayOrder) || 0,
        });
        setSuccessMsg('Project created and published successfully.');
      }

      await loadAll();
      setTimeout(() => {
        setIsModalOpen(false);
      }, 700);
    } catch (err: unknown) {
      // Clean up orphaned storage files if DB save failed
      if (newlyUploadedVideoPath) {
        await storageService.deleteFile(STORAGE_BUCKET_PORTFOLIO, newlyUploadedVideoPath);
      }
      if (newlyUploadedThumbPath) {
        await storageService.deleteFile(STORAGE_BUCKET_PORTFOLIO, newlyUploadedThumbPath);
      }

      const msg = err instanceof Error ? err.message : 'Failed to save project.';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
      setIsUploading(false);
    }
  };

  const autoGenerateSlug = (val: string) => {
    setTitle(val);
    if (!editingProject) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
            Portfolio Video Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Upload cinematic master videos directly to Supabase Storage. Automatic thumbnails and video previews are generated on upload.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', padding: '0.65rem 1.25rem' }}
        >
          <Plus size={18} /> Add Project
        </button>
      </div>

      {/* Projects Table */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
          <div style={{ color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '22px', height: '22px', border: '2px solid rgba(212,175,55,0.2)', borderTopColor: '#d4af37', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span>Loading portfolio projects...</span>
          </div>
        </div>
      ) : projects.length === 0 ? (
        <div
          className="card-glass"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            borderRadius: '1rem',
            border: '1px dashed rgba(212, 175, 55, 0.25)',
          }}
        >
          <Film size={44} style={{ color: 'var(--gold-400)', margin: '0 auto 1.25rem', opacity: 0.7 }} />
          <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '0.5rem' }}>No Portfolio Projects Yet</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 1.5rem', fontSize: '0.88rem' }}>
            Upload your first video to showcase your editing craft on the live website.
          </p>
          <button onClick={openAddModal} className="btn btn-primary" style={{ fontSize: '0.86rem' }}>
            <Plus size={16} /> Add First Project
          </button>
        </div>
      ) : (
        <div className="card-glass" style={{ borderRadius: '1rem', overflow: 'hidden', border: '1px solid var(--border-gold-subtle)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                  <th style={{ padding: '1rem 1.25rem', color: 'var(--gold-400)', fontWeight: 600 }}>Project Video & Title</th>
                  <th style={{ padding: '1rem 1.25rem', color: 'var(--gold-400)', fontWeight: 600 }}>Category</th>
                  <th style={{ padding: '1rem 1.25rem', color: 'var(--gold-400)', fontWeight: 600 }}>Ratio / Length</th>
                  <th style={{ padding: '1rem 1.25rem', color: 'var(--gold-400)', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '1rem 1.25rem', color: 'var(--gold-400)', fontWeight: 600 }}>Order</th>
                  <th style={{ padding: '1rem 1.25rem', color: 'var(--gold-400)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((proj) => (
                  <tr
                    key={proj.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.03)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div
                          style={{
                            width: '64px',
                            height: '42px',
                            borderRadius: '0.35rem',
                            overflow: 'hidden',
                            backgroundColor: '#000',
                            flexShrink: 0,
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            position: 'relative',
                          }}
                        >
                          <img
                            src={proj.thumbnail_url}
                            alt={proj.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              // If image fails, show subtle fallback background
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontWeight: 600, color: '#ffffff' }}>{proj.title}</span>
                            {proj.is_featured && (
                              <span
                                style={{
                                  fontSize: '0.65rem',
                                  padding: '0.15rem 0.45rem',
                                  borderRadius: '0.25rem',
                                  backgroundColor: 'rgba(212, 175, 55, 0.15)',
                                  color: 'var(--gold-400)',
                                  border: '1px solid rgba(212, 175, 55, 0.3)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                }}
                              >
                                <Sparkles size={10} /> Featured
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            /{proj.slug} {proj.video_storage_path ? '• Direct Storage' : ''}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: '#c0c0d0' }}>
                      {proj.category?.name || <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: '#c0c0d0' }}>
                      <span className="badge-dark" style={{ fontSize: '0.75rem', marginRight: '0.5rem' }}>
                        {proj.aspect_ratio}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{proj.duration}</span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <button
                        onClick={() => handleTogglePublish(proj)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.3rem 0.65rem',
                          borderRadius: '1rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          border: 'none',
                          backgroundColor: proj.is_published ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: proj.is_published ? '#4ade80' : '#f87171',
                        }}
                      >
                        {proj.is_published ? <Eye size={12} /> : <EyeOff size={12} />}
                        {proj.is_published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>{proj.display_order}</td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => openEditModal(proj)}
                          style={{
                            padding: '0.45rem',
                            borderRadius: '0.4rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#ffffff',
                            cursor: 'pointer',
                          }}
                          title="Edit Project"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(proj)}
                          style={{
                            padding: '0.45rem',
                            borderRadius: '0.4rem',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            color: '#f87171',
                            cursor: 'pointer',
                          }}
                          title="Delete Project"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            overflowY: 'auto',
          }}
        >
          <div
            className="card-glass"
            style={{
              width: '100%',
              maxWidth: '750px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '1.25rem',
              border: '1px solid var(--border-gold-subtle)',
              padding: '2rem',
              backgroundColor: '#0e0e15',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
                  {editingProject ? 'Edit Portfolio Project' : 'Upload Portfolio Project'}
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Select a video from your computer. Supabase Storage handles storage and automatic thumbnail generation.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.25rem',
                }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Error & Success Messages */}
            {errorMsg && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#fca5a5',
                  fontSize: '0.85rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <AlertCircle size={16} /> {errorMsg}
              </div>
            )}
            {successMsg && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  backgroundColor: 'rgba(34, 197, 94, 0.12)',
                  border: '1px solid rgba(34, 197, 94, 0.25)',
                  color: '#86efac',
                  fontSize: '0.85rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <CheckCircle2 size={16} /> {successMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* VIDEO UPLOAD FIELD */}
              <div
                style={{
                  marginBottom: '1.5rem',
                  padding: '1.25rem',
                  borderRadius: '0.85rem',
                  backgroundColor: 'rgba(20, 20, 30, 0.6)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                }}
              >
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
                  Project Video *
                </label>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  MP4 preferred (also supports WebM and QuickTime MOV). Up to 500MB per file.
                </p>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="video/mp4,video/webm,video/quicktime,video/m4v"
                  onChange={handleVideoSelect}
                  style={{ display: 'none' }}
                />

                {/* Dropzone / Picker Trigger */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '2px dashed rgba(212, 175, 55, 0.35)',
                    borderRadius: '0.75rem',
                    padding: '1.75rem 1rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--gold-400)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.35)')}
                >
                  <Upload size={32} style={{ color: 'var(--gold-400)', margin: '0 auto 0.75rem' }} />
                  <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.92rem', marginBottom: '0.25rem' }}>
                    {videoFile ? 'Click to replace video file' : 'Click to select project video from your computer'}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    Supports MP4, WebM, MOV. No manual URLs required.
                  </div>
                </div>

                {/* Selected File Details & Preview */}
                {(videoFile || existingVideoUrl) && (
                  <div
                    style={{
                      marginTop: '1.25rem',
                      padding: '1rem',
                      borderRadius: '0.75rem',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontSize: '0.85rem', fontWeight: 600 }}>
                        <FileVideo size={18} style={{ color: 'var(--gold-400)' }} />
                        <span>{videoFile ? videoFile.name : 'Current Project Master Video'}</span>
                        {videoFile && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                            ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--gold-400)',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <RefreshCw size={12} /> Replace
                      </button>
                    </div>

                    {/* Live Preview Player */}
                    <div style={{ borderRadius: '0.5rem', overflow: 'hidden', backgroundColor: '#000', maxHeight: '240px' }}>
                      <video
                        src={videoPreviewUrl || existingVideoUrl || undefined}
                        controls
                        playsInline
                        muted
                        style={{ width: '100%', maxHeight: '240px', objectFit: 'contain' }}
                      />
                    </div>
                  </div>
                )}

                {/* Upload Progress Bar */}
                {isUploading && (
                  <div style={{ marginTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--gold-400)', marginBottom: '0.35rem' }}>
                      <span>Uploading video to Supabase Storage...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', borderRadius: '3px', backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${uploadProgress}%`,
                          height: '100%',
                          backgroundColor: 'var(--gold-400)',
                          transition: 'width 0.2s ease',
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* 50MB Warning for Supabase Free Tier */}
                {videoFile && videoFile.size > 50 * 1024 * 1024 && (
                  <div
                    style={{
                      marginTop: '0.85rem',
                      padding: '0.75rem 1rem',
                      borderRadius: '0.5rem',
                      backgroundColor: 'rgba(234, 179, 8, 0.12)',
                      border: '1px solid rgba(234, 179, 8, 0.3)',
                      color: '#fef08a',
                      fontSize: '0.8rem',
                      lineHeight: 1.45,
                    }}
                  >
                    <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                      <AlertCircle size={15} style={{ color: '#facc15' }} /> File size is {(videoFile.size / (1024 * 1024)).toFixed(1)} MB (Exceeds 50MB default limit)
                    </div>
                    <div style={{ color: '#fef9c3', fontSize: '0.78rem' }}>
                      Supabase Free tier limits uploads to 50MB per file. If upload fails:
                      <br />
                      1. Increase bucket limit in Supabase SQL editor: <code style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '0.15rem 0.35rem', borderRadius: '0.25rem', color: 'var(--gold-400)' }}>UPDATE storage.buckets SET file_size_limit = 524288000 WHERE id = 'portfolio-media';</code>
                      <br />
                      2. Or compress/export video slightly under 50MB, or use the external video link option below.
                    </div>
                  </div>
                )}

                {/* Optional External Video Link Option */}
                <div style={{ marginTop: '0.85rem' }}>
                  <button
                    type="button"
                    onClick={() => setUseExternalLink(!useExternalLink)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--gold-400)',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'underline',
                    }}
                  >
                    {useExternalLink ? '– Use direct file upload instead' : '+ Or paste external video URL (for files > 50MB)'}
                  </button>

                  {useExternalLink && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <input
                        type="url"
                        value={externalVideoUrl}
                        onChange={(e) => setExternalVideoUrl(e.target.value)}
                        placeholder="https://... (Direct MP4, Cloudflare, Vimeo, or YouTube embed link)"
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: '0.65rem',
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          border: '1px solid rgba(212, 175, 55, 0.3)',
                          color: '#ffffff',
                          fontSize: '0.88rem',
                          outline: 'none',
                        }}
                      />
                      <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        Direct video link if your file exceeds Supabase Storage limits.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Title & Slug */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => autoGenerateSlug(e.target.value)}
                    placeholder="e.g. Apex Velocity Cinematic"
                    required
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: '0.75rem',
                      backgroundColor: 'rgba(22, 22, 32, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '0.92rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. apex-velocity-cinematic"
                    required
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: '0.75rem',
                      backgroundColor: 'rgba(22, 22, 32, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '0.92rem',
                      outline: 'none',
                      fontFamily: 'monospace',
                    }}
                  />
                </div>
              </div>

              {/* Category, Aspect Ratio, Duration */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                    Category
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: '0.75rem',
                      backgroundColor: '#161622',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '0.92rem',
                      outline: 'none',
                    }}
                  >
                    <option value="">Unassigned</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                    Aspect Ratio *
                  </label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value as '16:9' | '9:16' | '2.39:1')}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: '0.75rem',
                      backgroundColor: '#161622',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '0.92rem',
                      outline: 'none',
                    }}
                  >
                    <option value="16:9">16:9 Landscape (YouTube/Commercial)</option>
                    <option value="9:16">9:16 Vertical (Reels/Shorts)</option>
                    <option value="2.39:1">2.39:1 Anamorphic Cinema</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                    Duration
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="00:30"
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: '0.75rem',
                      backgroundColor: 'rgba(22, 22, 32, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '0.92rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                  Project Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  required
                  placeholder="Concise overview of editing highlights and visual narrative..."
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    borderRadius: '0.75rem',
                    backgroundColor: 'rgba(22, 22, 32, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontSize: '0.92rem',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Tools & Deliverables */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                    Tools Used (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={toolsStr}
                    onChange={(e) => setToolsStr(e.target.value)}
                    placeholder="Premiere Pro, DaVinci Resolve, After Effects"
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: '0.75rem',
                      backgroundColor: 'rgba(22, 22, 32, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '0.92rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                    Deliverables (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={deliverablesStr}
                    onChange={(e) => setDeliverablesStr(e.target.value)}
                    placeholder="4K UHD Master, 9:16 Social Cut"
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: '0.75rem',
                      backgroundColor: 'rgba(22, 22, 32, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '0.92rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Toggles */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', color: '#ffffff', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    style={{ accentColor: 'var(--gold-400)', width: '18px', height: '18px' }}
                  />
                  <span>Feature on Top of Grid</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', color: '#ffffff', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    style={{ accentColor: 'var(--gold-400)', width: '18px', height: '18px' }}
                  />
                  <span>Publish Immediately (Visible to Public)</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.86rem', padding: '0.65rem 1.25rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ fontSize: '0.86rem', padding: '0.65rem 1.35rem' }}
                >
                  {submitting ? 'Uploading & Saving...' : editingProject ? 'Save Changes' : 'Upload & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

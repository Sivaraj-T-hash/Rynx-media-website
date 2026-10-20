import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  MessageCircle,
  Sparkles,
  Check,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import type { DbPortfolioProject } from '../types/database';
import { getProjectEnquiryUrl } from '../config/contactConfig';

interface VideoPlayerModalProps {
  project: DbPortfolioProject | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ project, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [durationTime, setDurationTime] = useState('00:00');
  const [isBuffering, setIsBuffering] = useState(false);
  const [playbackError, setPlaybackError] = useState(false);

  // Playback control functions defined before useEffect to prevent temporal dead zone issues
  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      if (val === 0) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration || 1;
      setProgress((current / total) * 100);

      const curMin = Math.floor(current / 60);
      const curSec = Math.floor(current % 60);
      setCurrentTime(`${curMin < 10 ? '0' : ''}${curMin}:${curSec < 10 ? '0' : ''}${curSec}`);

      if (videoRef.current.duration) {
        const durMin = Math.floor(total / 60);
        const durSec = Math.floor(total % 60);
        setDurationTime(`${durMin < 10 ? '0' : ''}${durMin}:${durSec < 10 ? '0' : ''}${durSec}`);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = (newProgress / 100) * videoRef.current.duration;
      setProgress(newProgress);
    }
  };

  const handleRetryPlayback = () => {
    setPlaybackError(false);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setPlaybackError(true));
    }
  };

  // Autoplay video automatically when modal opens, handle fallback to muted playback, and pause when closed
  useEffect(() => {
    if (!project) return;

    // Reset progress and states
    setProgress(0);
    setPlaybackError(false);
    setIsBuffering(false);

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Attempt video playback immediately
    const video = videoRef.current;
    if (video) {
      // Try playing
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Unmuted autoplay blocked by browser policy: retry muted
            video.muted = true;
            setIsMuted(true);
            video
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => {
                // If even muted autoplay is prevented, user can tap play button
                setIsPlaying(false);
              });
          });
      }
    }

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      } else if (e.key === 'f' || e.key === 'F') {
        handleFullscreen();
      } else if (e.key === 'ArrowLeft' && videoRef.current) {
        e.preventDefault();
        videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
      } else if (e.key === 'ArrowRight' && videoRef.current) {
        e.preventDefault();
        videoRef.current.currentTime = Math.min(videoRef.current.duration || 100, videoRef.current.currentTime + 5);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      // Ensure video playback is paused on close
      if (video) {
        try {
          video.pause();
        } catch {
          // Ignore
        }
      }
    };
  }, [project, onClose]);

  if (!project) return null;

  const isVertical = project.aspect_ratio === '9:16';
  const videoSource = project.full_video_url || project.preview_video_url;
  const categoryName = project.category?.name || 'Featured Edit';

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'grid',
          gridTemplateColumns: isVertical ? 'minmax(280px, 420px) 1fr' : '1fr',
          gap: '2rem',
          padding: '2rem',
          position: 'relative',
        }}
        id="modal-grid"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close project modal"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.2)';
            e.currentTarget.style.borderColor = 'var(--gold-400)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
          }}
        >
          <X size={20} />
        </button>

        {/* Video Player Column */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              position: 'relative',
              borderRadius: '1rem',
              overflow: 'hidden',
              backgroundColor: '#000000',
              border: '1px solid var(--border-gold-subtle)',
              aspectRatio: isVertical ? '9/16' : '16/9',
              maxHeight: isVertical ? '650px' : '520px',
              width: '100%',
              margin: '0 auto',
            }}
          >
            {videoSource && !playbackError ? (
              <video
                ref={videoRef}
                src={videoSource}
                poster={project.thumbnail_url}
                autoPlay
                playsInline
                loop
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onWaiting={() => setIsBuffering(true)}
                onPlaying={() => {
                  setIsBuffering(false);
                  setIsPlaying(true);
                }}
                onError={() => setPlaybackError(true)}
                onClick={togglePlay}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  cursor: 'pointer',
                  display: 'block',
                }}
              />
            ) : playbackError ? (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2rem',
                  backgroundColor: '#0a0a10',
                  color: '#ffffff',
                  textAlign: 'center',
                }}
              >
                <AlertCircle size={36} style={{ color: '#f87171', marginBottom: '0.75rem' }} />
                <h4 style={{ fontSize: '1.05rem', marginBottom: '0.35rem' }}>Video Playback Notice</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '340px', marginBottom: '1.25rem' }}>
                  Unable to load media directly. Please verify file encoding or storage network connection.
                </p>
                <button
                  onClick={handleRetryPlayback}
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem' }}
                >
                  <RefreshCw size={14} /> Retry Playback
                </button>
              </div>
            ) : (
              <img
                src={project.thumbnail_url}
                alt={project.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            )}

            {/* Buffering Indicator */}
            {isBuffering && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  pointerEvents: 'none',
                  zIndex: 4,
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    border: '3px solid rgba(212,175,55,0.25)',
                    borderTopColor: 'var(--gold-400)',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
              </div>
            )}

            {/* Center Play Button Overlay when paused */}
            {videoSource && !playbackError && !isPlaying && (
              <div
                onClick={togglePlay}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  zIndex: 4,
                  cursor: 'pointer',
                }}
              >
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label="Play video"
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--gold-400)',
                    color: '#07070a',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 30px rgba(212, 175, 55, 0.7)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <Play size={28} style={{ marginLeft: '4px' }} fill="#07070a" />
                </button>
              </div>
            )}

            {/* Custom Black-and-Gold Floating Controls */}
            {videoSource && !playbackError && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '1rem',
                  background: 'linear-gradient(0deg, rgba(5,5,8,0.92) 0%, rgba(5,5,8,0.4) 65%, rgba(0,0,0,0) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  zIndex: 5,
                }}
              >
                {/* Progress Scrubber */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={progress}
                  onChange={handleSeek}
                  aria-label="Video seek slider"
                  style={{
                    width: '100%',
                    accentColor: 'var(--gold-400)',
                    cursor: 'pointer',
                    height: '4px',
                  }}
                />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    {/* Play/Pause */}
                    <button
                      onClick={togglePlay}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        padding: 0,
                      }}
                      aria-label={isPlaying ? 'Pause video (Space)' : 'Play video (Space)'}
                      title="Space to toggle play/pause"
                    >
                      {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    </button>

                    {/* Mute & Volume */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button
                        onClick={toggleMute}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          padding: 0,
                        }}
                        aria-label={isMuted ? 'Unmute (M)' : 'Mute (M)'}
                        title="M to toggle mute"
                      >
                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                      </button>

                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        aria-label="Volume slider"
                        style={{
                          width: '55px',
                          accentColor: 'var(--gold-400)',
                          cursor: 'pointer',
                          height: '3px',
                        }}
                      />
                    </div>

                    {/* Time Counter */}
                    <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#c0c0cb' }}>
                      {currentTime} / {durationTime || project.duration || '00:30'}
                    </span>
                  </div>

                  {/* Fullscreen */}
                  <button
                    onClick={handleFullscreen}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: 0,
                    }}
                    aria-label="Fullscreen (F)"
                    title="Fullscreen"
                  >
                    <Maximize size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Project Details Column */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
            <span className="badge-gold">{categoryName}</span>
            <span className="badge-dark">{project.aspect_ratio} format</span>
            {project.duration && <span className="badge-dark">{project.duration}</span>}
          </div>

          <h2
            id="modal-project-title"
            style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: '1rem',
              color: '#ffffff',
            }}
          >
            {project.title}
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            {project.description}
          </p>

          {/* Tools & Deliverables */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {project.tools_used && project.tools_used.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--gold-400)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  Post-Production Suite
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {project.tools_used.map((tool, idx) => (
                    <span key={idx} className="badge-dark" style={{ fontSize: '0.78rem' }}>
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.deliverables && project.deliverables.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--gold-400)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  Delivered Assets
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {project.deliverables.map((item, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c0c0d0', fontSize: '0.85rem' }}>
                      <Check size={14} style={{ color: 'var(--gold-400)' }} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href={getProjectEnquiryUrl(project.title)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
            >
              <MessageCircle size={18} /> Enquire About This Style
            </a>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <Sparkles size={12} style={{ display: 'inline', marginRight: '0.25rem', color: 'var(--gold-400)' }} />
              Direct WhatsApp Discussion
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize, MessageCircle, Sparkles, Check } from 'lucide-react';
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
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [durationTime, setDurationTime] = useState('00:00');

  useEffect(() => {
    if (!project) return;

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Keyboard listener for Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
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

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

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
          gridTemplateColumns: isVertical ? 'minmax(320px, 420px) 1fr' : '1fr',
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
            {videoSource ? (
              <video
                ref={videoRef}
                src={videoSource}
                poster={project.thumbnail_url}
                autoPlay
                playsInline
                loop
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onClick={togglePlay}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  cursor: 'pointer',
                  display: 'block',
                }}
              />
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

            {/* Custom Floating Controls */}
            {videoSource && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '1rem',
                  background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                {/* Progress Slider */}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                      onClick={togglePlay}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    </button>

                    <button
                      onClick={toggleMute}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>

                    <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#a0a0ab' }}>
                      {currentTime} / {durationTime || project.duration || '00:30'}
                    </span>
                  </div>

                  <button
                    onClick={handleFullscreen}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    aria-label="Fullscreen"
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

          {project.case_study && (
            <div
              style={{
                backgroundColor: 'rgba(20, 20, 30, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '0.85rem',
                padding: '1.15rem',
                marginBottom: '1.5rem',
              }}
            >
              <h4 style={{ fontSize: '0.85rem', color: 'var(--gold-300)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={14} /> Creative Direction & Editing Breakdown
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#c4c4cf', lineHeight: 1.55 }}>
                {project.case_study}
              </p>
            </div>
          )}

          {/* Tools & Deliverables Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            {project.tools_used && project.tools_used.length > 0 && (
              <div>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                  Tools Utilized
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {project.tools_used.map((tool) => (
                    <span key={tool} className="badge-dark" style={{ fontSize: '0.75rem' }}>
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.deliverables && project.deliverables.length > 0 && (
              <div>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                  Deliverables
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {project.deliverables.map((item) => (
                    <span key={item} style={{ fontSize: '0.82rem', color: '#d0d0db', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Check size={12} color="var(--gold-400)" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href={getProjectEnquiryUrl(project.title)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
              style={{ flex: 1, minWidth: '220px', padding: '0.85rem 1.5rem', fontSize: '0.92rem' }}
            >
              <MessageCircle size={18} />
              Get Similar Editing
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 840px) {
          #modal-grid {
            grid-template-columns: 1fr !important;
            padding: 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
};

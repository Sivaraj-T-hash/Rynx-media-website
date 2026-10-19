import React, { useRef, useEffect, useState } from 'react';
import { Play, Sparkles, MessageCircle, ArrowUpRight } from 'lucide-react';
import type { DbPortfolioProject } from '../types/database';
import { getProjectEnquiryUrl } from '../config/contactConfig';

interface VideoProjectCardProps {
  project: DbPortfolioProject;
  isModalOpen: boolean;
  activePlayingId: string | null;
  setActivePlayingId: (id: string | null) => void;
  onOpenModal: (project: DbPortfolioProject) => void;
}

export const VideoProjectCard: React.FC<VideoProjectCardProps> = ({
  project,
  isModalOpen,
  activePlayingId,
  setActivePlayingId,
  onOpenModal,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const isVertical = project.aspect_ratio === '9:16';
  const shouldPlay = !isModalOpen && (isHovered || (isInViewport && activePlayingId === project.id));

  // IntersectionObserver for viewport tracking
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setIsInViewport(true);
          } else {
            setIsInViewport(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Handle play / pause logic safely
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isModalOpen) {
      video.pause();
      return;
    }

    if (shouldPlay && (project.preview_video_url || project.full_video_url)) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay policy prevented playback, fallback quietly
        });
      }
    } else {
      video.pause();
      if (!isHovered) {
        video.currentTime = 0;
      }
    }
  }, [shouldPlay, isModalOpen, isHovered, project.preview_video_url, project.full_video_url]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setActivePlayingId(project.id);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const videoSource = project.preview_video_url || project.full_video_url;
  const categoryName = project.category?.name || 'Featured Edit';

  return (
    <div
      ref={containerRef}
      className="card-glass"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '1.25rem',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        backgroundColor: '#0c0c12',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Media Container with correct Aspect Ratio */}
      <div
        onClick={() => onOpenModal(project)}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: isVertical ? '9/16' : '16/9',
          maxHeight: isVertical ? '520px' : '320px',
          overflow: 'hidden',
          backgroundColor: '#050508',
          cursor: 'pointer',
        }}
      >
        {/* Poster Image (Visible before video or when idle) */}
        <img
          src={project.thumbnail_url}
          alt={project.title}
          loading="lazy"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
            transform: isHovered ? 'scale(1.04)' : 'scale(1)',
            opacity: isHovered && videoLoaded && videoSource ? 0 : 1,
            zIndex: 1,
          }}
        />

        {/* Lightweight Video Preview if available */}
        {videoSource && (
          <video
            ref={videoRef}
            src={videoSource}
            muted
            loop
            playsInline
            preload="none"
            onLoadedData={() => setVideoLoaded(true)}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 2,
              opacity: isHovered || (isInViewport && activePlayingId === project.id) ? 1 : 0,
              transition: 'opacity 0.35s ease',
            }}
          />
        )}

        {/* Dark Vignette Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(7, 7, 10, 0.2) 0%, rgba(7, 7, 10, 0.1) 50%, rgba(7, 7, 10, 0.8) 100%)',
            zIndex: 3,
            pointerEvents: 'none',
          }}
        />

        {/* Top Badges */}
        <div
          style={{
            position: 'absolute',
            top: '0.85rem',
            left: '0.85rem',
            right: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 4,
          }}
        >
          <span className="badge-dark" style={{ backdropFilter: 'blur(8px)', fontSize: '0.72rem' }}>
            {categoryName}
          </span>

          {project.is_featured && (
            <span className="badge-gold" style={{ fontSize: '0.7rem', padding: '0.25rem 0.65rem' }}>
              <Sparkles size={11} /> Featured
            </span>
          )}
        </div>

        {/* Play Icon Affordance */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 4,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: isHovered ? 'var(--gold-400)' : 'rgba(12, 12, 18, 0.75)',
              color: isHovered ? '#07070a' : '#ffffff',
              border: isHovered ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: isHovered ? 'scale(1.12)' : 'scale(1)',
              boxShadow: isHovered ? '0 0 25px rgba(212, 175, 55, 0.6)' : 'none',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Play size={22} style={{ marginLeft: '3px' }} fill={isHovered ? '#07070a' : 'none'} />
          </div>
        </div>

        {/* Bottom Format & Duration Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '0.85rem',
            right: '0.85rem',
            zIndex: 4,
          }}
        >
          <span className="badge-dark" style={{ fontFamily: 'monospace', fontSize: '0.72rem' }}>
            {project.duration || '00:30'} • {project.aspect_ratio}
          </span>
        </div>
      </div>

      {/* Card Info & Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3
          onClick={() => onOpenModal(project)}
          style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            lineHeight: 1.3,
            marginBottom: '0.5rem',
            cursor: 'pointer',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-300)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#ffffff')}
        >
          {project.title}
        </h3>

        <p
          style={{
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            marginBottom: '1.25rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {project.description}
        </p>

        {/* Deliverables / Tools pills */}
        {project.tools_used && project.tools_used.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
            {project.tools_used.slice(0, 3).map((tool) => (
              <span
                key={tool}
                style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                {tool}
              </span>
            ))}
          </div>
        )}

        {/* Card Action Buttons */}
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.65rem',
            paddingTop: '0.85rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <button
            onClick={() => onOpenModal(project)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: 0,
            }}
          >
            <span>View Breakdown</span>
            <ArrowUpRight size={15} color="var(--gold-400)" />
          </button>

          <a
            href={getProjectEnquiryUrl(project.title)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
            style={{
              padding: '0.45rem 0.95rem',
              fontSize: '0.78rem',
              borderRadius: '999px',
            }}
            title="Chat on WhatsApp regarding this edit style"
          >
            <MessageCircle size={14} />
            <span>Enquire</span>
          </a>
        </div>
      </div>
    </div>
  );
};

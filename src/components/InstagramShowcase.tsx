import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { InstagramIcon } from './SocialIcons';
import { CONTACT_CONFIG } from '../config/contactConfig';

interface ReelItem {
  id: string;
  title: string;
  videoSrc: string;
  tag: string;
}

const UPLOADED_REELS: ReelItem[] = [
  {
    id: 'reel-1',
    title: 'Cinematic Visual Sequence',
    videoSrc: '/videos/689ea04f5f41f8772af9bec15ebec5c7_0_32266666.mp4',
    tag: 'Master Cut',
  },
  {
    id: 'reel-2',
    title: 'Dynamic Rhythm & Sound Design',
    videoSrc: '/videos/a06aa9fa3eba766aa7ce9e554061c3a1_0_35100000.mp4',
    tag: 'Pacing & Transition',
  },
  {
    id: 'reel-3',
    title: 'Commercial Post-Production Grade',
    videoSrc: '/videos/lv_0_20260806183404.mp4',
    tag: 'Final Grade',
  },
];

interface ReelCardProps {
  reel: ReelItem;
}

const ReelCard: React.FC<ReelCardProps> = ({ reel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState('0:00');
  const [durationStr, setDurationStr] = useState('0:00');
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play when card enters viewport
  useEffect(() => {
    const el = containerRef.current;
    const video = videoRef.current;
    if (!el || !video) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.muted = isMuted;
            video
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => {
                setIsPlaying(false);
              });
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isMuted]);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const cur = video.currentTime;
    const dur = video.duration || 1;
    setProgress((cur / dur) * 100);

    const curM = Math.floor(cur / 60);
    const curS = Math.floor(cur % 60);
    setCurrentTimeStr(`${curM}:${curS < 10 ? '0' : ''}${curS}`);

    if (video.duration) {
      const durM = Math.floor(dur / 60);
      const durS = Math.floor(dur % 60);
      setDurationStr(`${durM}:${durS < 10 ? '0' : ''}${durS}`);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const newPct = parseFloat(e.target.value);
    video.currentTime = (newPct / 100) * video.duration;
    setProgress(newPct);
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  return (
    <div
      ref={containerRef}
      className="card-glass"
      style={{
        borderRadius: '1.25rem',
        overflow: 'hidden',
        position: 'relative',
        aspectRatio: '9/16',
        backgroundColor: '#0a0a12',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        boxShadow: isHovered
          ? '0 15px 35px rgba(212, 175, 55, 0.15)'
          : '0 10px 25px rgba(0, 0, 0, 0.6)',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => togglePlay()}
    >
      {/* Autoplay HTML5 Video */}
      <video
        ref={videoRef}
        src={reel.videoSrc}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />

      {/* Dark Vignette Gradients */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.92) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Bar: Tag & Audio / Instagram Buttons */}
      <div
        style={{
          position: 'absolute',
          top: '0.85rem',
          left: '0.85rem',
          right: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 5,
        }}
      >
        <span
          className="badge-dark"
          style={{
            fontSize: '0.72rem',
            padding: '0.25rem 0.6rem',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <Sparkles size={11} style={{ color: 'var(--gold-400)', marginRight: '0.3rem' }} />
          {reel.tag}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Mute / Unmute Button */}
          <button
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute video sound' : 'Mute video sound'}
            title={isMuted ? 'Click to Unmute' : 'Click to Mute'}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: isMuted ? 'rgba(0, 0, 0, 0.65)' : 'var(--gold-400)',
              color: isMuted ? '#ffffff' : '#07070a',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease',
            }}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {/* Instagram Link Icon */}
          <a
            href={CONTACT_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textDecoration: 'none',
            }}
            title="View on Instagram"
          >
            <InstagramIcon size={16} color="var(--gold-400)" />
          </a>
        </div>
      </div>

      {/* Center Play Indicator (when paused) */}
      {!isPlaying && (
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
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: 'rgba(212, 175, 55, 0.9)',
              color: '#07070a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(212, 175, 55, 0.6)',
            }}
          >
            <Play size={24} fill="#07070a" style={{ marginLeft: '3px' }} />
          </div>
        </div>
      )}

      {/* Bottom Customized Player Controls & Caption */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '1.25rem 1rem 1rem',
          zIndex: 5,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
        }}
      >
        {/* Caption */}
        <div>
          <h3
            style={{
              fontSize: '1rem',
              color: '#ffffff',
              fontWeight: 700,
              lineHeight: 1.3,
              marginBottom: '0.2rem',
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
            }}
          >
            {reel.title}
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--gold-300)' }}>
            @raman_kandhan • RYNX Digital Media
          </p>
        </div>

        {/* Customized Timeline Scrubber */}
        <div style={{ position: 'relative', width: '100%' }} onClick={(e) => e.stopPropagation()}>
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleSeek}
            aria-label="Seek video position"
            style={{
              width: '100%',
              accentColor: 'var(--gold-400)',
              cursor: 'pointer',
              height: '4px',
              display: 'block',
            }}
          />
        </div>

        {/* Control Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: '#d0d0db',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
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
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>

            <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'var(--gold-300)' }}>
              {currentTimeStr} / {durationStr}
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
              padding: 0,
            }}
            aria-label="Fullscreen"
            title="Fullscreen"
          >
            <Maximize size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const InstagramShowcase: React.FC = () => {
  return (
    <section
      id="instagram"
      style={{
        paddingTop: '6.5rem',
        paddingBottom: '6.5rem',
        backgroundColor: '#060609',
        position: 'relative',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <span className="badge-gold">
              <InstagramIcon size={12} /> Social Media Highlights
            </span>
          </div>

          <h2 className="editorial-title">Follow Our Creative Journey</h2>

          <p>
            Watch real cinematic editing cutdowns, sound design sequences, and short-form video reels produced by RYNX Digital Media.
          </p>
        </div>

        {/* Uploaded Video Reels Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.75rem',
            maxWidth: '1100px',
            margin: '0 auto 3rem',
          }}
          className="ig-grid"
        >
          {UPLOADED_REELS.map((reel) => (
            <ReelCard key={reel.id} reel={reel} />
          ))}
        </div>

        {/* Follow CTA Bar */}
        <div style={{ textAlign: 'center' }}>
          <a
            href={CONTACT_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ padding: '0.9rem 2.25rem', gap: '0.75rem' }}
          >
            <InstagramIcon size={18} color="var(--gold-400)" />
            <span>Follow {CONTACT_CONFIG.instagramHandle} on Instagram</span>
            <ArrowUpRight size={16} color="var(--gold-400)" />
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .ig-grid {
            grid-template-columns: 1fr !important;
            max-width: 360px !important;
          }
        }
      `}</style>
    </section>
  );
};

import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, ArrowDown, Sparkles, Film, ArrowUpRight } from 'lucide-react';
import logoImg from '../assets/logo.jpeg';

export const HeroSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '7rem',
        paddingBottom: '5rem',
        overflow: 'hidden',
        backgroundColor: '#060609',
      }}
    >
      {/* Cinematic Ambient Background Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '75vw',
          height: '450px',
          background: 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.14) 0%, rgba(138, 43, 226, 0.05) 45%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '3.5rem',
            alignItems: 'center',
          }}
          className="hero-grid"
        >
          {/* Editorial Text Content */}
          <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>
            {/* Agency Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.45rem 1.15rem',
                borderRadius: '9999px',
                background: 'rgba(20, 20, 30, 0.75)',
                border: '1px solid var(--border-gold-subtle)',
                marginBottom: '1.75rem',
                backdropFilter: 'blur(10px)',
              }}
            >
              <img
                src={logoImg}
                alt="RYNX"
                style={{ width: '18px', height: '18px', borderRadius: '4px', objectFit: 'cover' }}
              />
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: 'var(--gold-300)',
                  textTransform: 'uppercase',
                }}
              >
                RYNX Digital Media — Creative Video Agency
              </span>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.4rem, 5.8vw, 4.6rem)',
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: '-0.03em',
                marginBottom: '1.5rem',
              }}
            >
              We Don't Just Edit Videos.{' '}
              <span className="text-gold-gradient">We Create Impact.</span>
            </h1>

            {/* Supporting Text */}
            <p
              style={{
                fontSize: 'clamp(1.05rem, 1.8vw, 1.28rem)',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                maxWidth: '640px',
                margin: '0 auto 2.5rem auto',
                fontWeight: 400,
              }}
            >
              Turning raw footage into powerful visual stories that capture attention, build brands, and drive results.
            </p>

            {/* CTAs */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.15rem',
                flexWrap: 'wrap',
                marginBottom: '3rem',
              }}
            >
              <button
                onClick={() => scrollToSection('#portfolio')}
                className="btn btn-primary"
                style={{ padding: '0.95rem 2.25rem', fontSize: '1rem' }}
              >
                <Film size={18} />
                Explore Our Work
              </button>

              <button
                onClick={() => scrollToSection('#contact')}
                className="btn btn-secondary"
                style={{ padding: '0.95rem 2rem', fontSize: '1rem' }}
              >
                Get Your Video Edited
                <ArrowUpRight size={18} color="var(--gold-400)" />
              </button>
            </div>

            {/* Studio Capabilities Pills */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.25rem',
                flexWrap: 'wrap',
                opacity: 0.85,
              }}
            >
              <span className="badge-dark">
                <Sparkles size={12} color="var(--gold-400)" />
                Cinematic Color Grading
              </span>
              <span className="badge-dark">
                <Sparkles size={12} color="var(--gold-400)" />
                Retention-Driven Pacing
              </span>
              <span className="badge-dark">
                <Sparkles size={12} color="var(--gold-400)" />
                Custom Motion Graphics
              </span>
              <span className="badge-dark">
                <Sparkles size={12} color="var(--gold-400)" />
                Multi-Platform Formats
              </span>
            </div>
          </div>

          {/* Cinematic Showreel Player Composition */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '1080px',
              margin: '0 auto',
            }}
          >
            {/* Outer Decorative Film Frame */}
            <div
              style={{
                position: 'relative',
                borderRadius: '1.5rem',
                overflow: 'hidden',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                background: '#09090f',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.95), 0 0 30px rgba(212, 175, 55, 0.1)',
                aspectRatio: '16/9',
                maxHeight: '560px',
              }}
            >
              {/* Cinematic Video Element */}
              <video
                ref={videoRef}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                poster="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1400&auto=format&fit=crop"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              >
                <source
                  src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4"
                  type="video/mp4"
                />
                Your browser does not support video playback.
              </video>

              {/* Cinematic Gradient Vignette */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(6, 6, 8, 0.35) 0%, rgba(6, 6, 8, 0.1) 40%, rgba(6, 6, 8, 0.85) 100%)',
                  pointerEvents: 'none',
                }}
              />

              {/* Showreel Top Metadata Bar */}
              <div
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  left: '1.5rem',
                  right: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  zIndex: 2,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#ef4444',
                      boxShadow: '0 0 10px #ef4444',
                      animation: 'pulse 1.8s infinite',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      color: '#ffffff',
                      textTransform: 'uppercase',
                    }}
                  >
                    RYNX REEL • MASTER TIMECODE [00:01:42:16]
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge-dark" style={{ fontSize: '0.7rem' }}>
                    4K PRORES
                  </span>
                  <span className="badge-dark" style={{ fontSize: '0.7rem' }}>
                    60 FPS
                  </span>
                </div>
              </div>

              {/* Showreel Bottom Control Overlay */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '1.25rem',
                  left: '1.5rem',
                  right: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  zIndex: 2,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <button
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pause Showreel' : 'Play Showreel'}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(15, 15, 22, 0.85)',
                      border: '1px solid var(--border-gold-subtle)',
                      color: 'var(--gold-400)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
                  </button>

                  <button
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(15, 15, 22, 0.85)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                </div>

                <div style={{ textAlign: 'right', display: 'none' }} className="reel-tagline">
                  <span style={{ fontSize: '0.82rem', color: 'var(--gold-300)', fontWeight: 600 }}>
                    Crafted with DaVinci Resolve & Premiere Pro
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Restrained Scroll Down Indicator */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '1rem',
              cursor: 'pointer',
              opacity: 0.75,
              transition: 'opacity 0.2s ease',
            }}
            onClick={() => scrollToSection('#portfolio')}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.75')}
          >
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold-400)' }}>
              Scroll to explore
            </span>
            <ArrowDown size={16} color="var(--gold-400)" style={{ animation: 'bounce 2s infinite' }} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.9); }
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(6px); }
          60% { transform: translateY(3px); }
        }
        @media (min-width: 640px) {
          .reel-tagline {
            display: block !important;
          }
        }
      `}</style>
    </section>
  );
};

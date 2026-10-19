import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Sparkles, SlidersHorizontal, Info } from 'lucide-react';
import type { DbBeforeAfterProject } from '../types/database';
import { beforeAfterService } from '../services/beforeAfterService';

// Built-in cinematic sample images encoded as high-definition SVGs (100% self-contained, zero network breakage)
const SAMPLE_RAW_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="rawSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4a4d50"/>
      <stop offset="100%" stop-color="#5a5e62"/>
    </linearGradient>
    <linearGradient id="rawMtn" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#55585b"/>
      <stop offset="100%" stop-color="#3d4043"/>
    </linearGradient>
    <linearGradient id="rawCar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#4f5255"/>
      <stop offset="100%" stop-color="#606468"/>
    </linearGradient>
  </defs>
  <!-- Background Flat LOG Sky -->
  <rect width="100%" height="100%" fill="url(#rawSky)"/>
  <!-- Mountain silhouette (Low contrast) -->
  <polygon points="0,520 220,380 480,470 760,340 1060,450 1280,360 1280,720 0,720" fill="url(#rawMtn)"/>
  <!-- Road -->
  <polygon points="0,720 480,520 800,520 1280,720" fill="#35373a"/>
  <!-- Sports Coupe Silhouette (Flat desaturated) -->
  <path d="M 440 560 L 520 490 L 720 490 L 840 560 L 860 610 L 420 610 Z" fill="url(#rawCar)"/>
  <circle cx="500" cy="610" r="32" fill="#2b2d2f"/>
  <circle cx="780" cy="610" r="32" fill="#2b2d2f"/>
  
  <!-- Technical Camera Viewfinder Overlays -->
  <rect x="30" y="30" width="1220" height="660" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="1.5" stroke-dasharray="8 8"/>
  <circle cx="640" cy="360" r="14" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/>
  <line x1="620" y1="360" x2="660" y2="360" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/>
  <line x1="640" y1="340" x2="640" y2="380" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/>
  
  <text x="60" y="80" font-family="monospace" font-size="16" fill="rgba(255,255,255,0.6)" letter-spacing="2">ARRI ALEXA MINI LF • ARRI LOG-C</text>
  <text x="60" y="110" font-family="monospace" font-size="14" fill="rgba(255,255,255,0.4)">ISO 800 • 24.00 FPS • 180.0° • UNGRADED SENSOR FEED</text>
  <text x="1220" y="80" text-anchor="end" font-family="monospace" font-size="16" fill="#f87171" font-weight="700">● RAW CAPTURE</text>
</svg>
`)}`;

const SAMPLE_GRADED_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <!-- Rich Cinematic Golden Hour Sky -->
    <linearGradient id="goldSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0d1117"/>
      <stop offset="35%" stop-color="#1f1828"/>
      <stop offset="70%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
    <linearGradient id="goldMtn" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1c121e"/>
      <stop offset="100%" stop-color="#080709"/>
    </linearGradient>
    <linearGradient id="goldCar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#111317"/>
      <stop offset="40%" stop-color="#d4af37"/>
      <stop offset="70%" stop-color="#fffbeb"/>
      <stop offset="100%" stop-color="#0a0b0d"/>
    </linearGradient>
    <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fef08a" stop-opacity="0.8"/>
      <stop offset="40%" stop-color="#f59e0b" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#b45309" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <!-- Background Saturated Sky -->
  <rect width="100%" height="100%" fill="url(#goldSky)"/>
  <!-- Golden Sun Core & Anamorphic Flare -->
  <circle cx="640" cy="360" r="140" fill="url(#sunGlow)"/>
  <ellipse cx="640" cy="360" rx="600" ry="6" fill="#fef08a" opacity="0.6"/>
  <!-- Mountain Silhouette (High contrast rich black) -->
  <polygon points="0,520 220,380 480,470 760,340 1060,450 1280,360 1280,720 0,720" fill="url(#goldMtn)"/>
  <!-- Road with Golden Asphalt Reflections -->
  <polygon points="0,720 480,520 800,520 1280,720" fill="#0c0c0f"/>
  <line x1="640" y1="520" x2="640" y2="720" stroke="#f59e0b" stroke-width="4" stroke-dasharray="24 24" opacity="0.8"/>
  <!-- Glossy Black & Gold Sports Car -->
  <path d="M 440 560 L 520 490 L 720 490 L 840 560 L 860 610 L 420 610 Z" fill="url(#goldCar)"/>
  <circle cx="500" cy="610" r="32" fill="#000000" stroke="#d4af37" stroke-width="3"/>
  <circle cx="780" cy="610" r="32" fill="#000000" stroke="#d4af37" stroke-width="3"/>
  <!-- Tail light neon streak -->
  <line x1="840" y1="570" x2="865" y2="570" stroke="#ef4444" stroke-width="6" stroke-linecap="round"/>
  
  <text x="60" y="80" font-family="system-ui, sans-serif" font-size="16" fill="#fef08a" font-weight="700" letter-spacing="2">RYNX MASTER GRADE • REC.709 DCI-P3</text>
  <text x="60" y="110" font-family="system-ui, sans-serif" font-size="14" fill="#fed7aa">FILM PRINT EMULATION • SCULPTED HIGHLIGHTS • 35MM GRAIN</text>
  <text x="1220" y="80" text-anchor="end" font-family="system-ui, sans-serif" font-size="16" fill="#4ade80" font-weight="700">★ FINAL MASTER</text>
</svg>
`)}`;

const BUILT_IN_SAMPLE: DbBeforeAfterProject = {
  id: 'sample-transformation',
  project_name: 'Cinematic Grade Transformation',
  description: 'Sample grade demonstration showing flat sensor LOG footage sculpted with warm golden tones and film-print contrast.',
  raw_footage_url: SAMPLE_RAW_IMAGE,
  final_video_url: SAMPLE_GRADED_IMAGE,
  is_featured: true,
  is_published: true,
  display_order: 0,
  created_at: new Date().toISOString(),
};

export const BeforeAfterComparison: React.FC = () => {
  const [items, setItems] = useState<DbBeforeAfterProject[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(1000);

  // Fetch real published records from Supabase
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const data = await beforeAfterService.getPublishedBeforeAfter();
        if (isMounted) {
          setItems(data);
        }
      } catch (err) {
        console.warn('Before & After load notice:', err);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Use real items if present, otherwise display built-in sample
  const hasRealItems = items.length > 0;
  const activeItems = hasRealItems ? items : [BUILT_IN_SAMPLE];
  const currentProject = activeItems[activeIndex] || activeItems[0];

  // Keep inner clipped image precisely aligned with container width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateWidth = () => {
      setContainerWidth(el.offsetWidth);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, [items]);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      setSliderPosition((prev) => Math.min(100, prev + 5));
    } else if (e.key === 'Home') {
      setSliderPosition(0);
    } else if (e.key === 'End') {
      setSliderPosition(100);
    }
  };

  return (
    <section
      id="comparison"
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
              <Sparkles size={12} /> Visual Transformation
            </span>
          </div>

          <h2 className="editorial-title">Raw Footage vs. Final Edit</h2>

          <p>
            Drag the interactive slider to see how flat camera LOG footage is transformed through cinematic color grading, tone sculpting, and visual mastery.
          </p>

          {/* Sample Demonstration Indicator if no real records yet */}
          {!hasRealItems && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: 'rgba(212, 175, 55, 0.08)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                color: 'var(--gold-400)',
                padding: '0.35rem 0.85rem',
                borderRadius: '1rem',
                fontSize: '0.78rem',
                marginTop: '1rem',
              }}
            >
              <Info size={13} />
              <span>Demonstration Sample (Upload real before/after client frames in the Admin Dashboard to replace)</span>
            </div>
          )}

          {/* Selector when multiple real comparisons exist */}
          {hasRealItems && items.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.25rem' }}>
              {items.map((it, idx) => (
                <button
                  key={it.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`btn ${idx === activeIndex ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}
                >
                  {it.is_featured && <Sparkles size={12} style={{ marginRight: '0.3rem' }} />}
                  {it.project_name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Comparison Interactive Container */}
        <div
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            position: 'relative',
          }}
        >
          <div
            ref={containerRef}
            className="before-after-container"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            tabIndex={0}
            role="slider"
            aria-label="Before and after editing comparison slider"
            aria-valuenow={Math.round(sliderPosition)}
            aria-valuemin={0}
            aria-valuemax={100}
            onKeyDown={handleKeyDown}
            style={{
              aspectRatio: '16/9',
              cursor: 'ew-resize',
              outline: 'none',
              borderRadius: '1.25rem',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Background: Final Graded Edit */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
              }}
            >
              <img
                src={currentProject.final_video_url}
                alt={`${currentProject.project_name} - Final Grade`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />

              {/* Final Edit Label Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  zIndex: 3,
                }}
              >
                <span
                  className="badge-gold"
                  style={{
                    boxShadow: '0 4px 15px rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(8px)',
                    fontSize: '0.78rem',
                  }}
                >
                  FINAL EDIT (COLOR GRADED & MASTERED)
                </span>
              </div>
            </div>

            {/* Foreground Clipped Image: RAW / LOG Footage */}
            <div
              className="before-after-overlay"
              style={{ width: `${sliderPosition}%` }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: `${containerWidth}px`,
                  height: '100%',
                }}
              >
                <img
                  src={currentProject.raw_footage_url}
                  alt={`${currentProject.project_name} - Raw Log Footage`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>

              {/* Raw Footage Label Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  left: '1.25rem',
                  zIndex: 3,
                }}
              >
                <span
                  className="badge-dark"
                  style={{
                    boxShadow: '0 4px 15px rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(8px)',
                    fontSize: '0.78rem',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                  }}
                >
                  RAW FOOTAGE (LOG / UNGRADED)
                </span>
              </div>
            </div>

            {/* Draggable Divider Handle */}
            <div
              className="before-after-handle"
              style={{ left: `${sliderPosition}%` }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
            >
              <SlidersHorizontal size={18} />
            </div>
          </div>

          {/* Interactive Instructions & Project Details */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '1.25rem',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--gold-400)' }}>◄</span>
              <span>Drag slider or use Left / Right arrow keys</span>
              <span style={{ color: 'var(--gold-400)' }}>►</span>
            </div>

            {currentProject.description && (
              <div style={{ color: '#d0d0db', fontSize: '0.82rem' }}>
                {currentProject.description}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Sparkles, SlidersHorizontal } from 'lucide-react';
import type { DbBeforeAfterProject } from '../types/database';
import { beforeAfterService } from '../services/beforeAfterService';

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
    }
  };

  // Rule: Hide the comparison item when there is no real content from Supabase
  if (items.length === 0) {
    return null;
  }

  const currentProject = items[activeIndex] || items[0];

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
            Drag the slider to see how flat LOG camera footage is transformed through cinematic color grading, tone sculpting, and visual mastery.
          </p>

          {items.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.25rem' }}>
              {items.map((it, idx) => (
                <button
                  key={it.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`btn ${idx === activeIndex ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}
                >
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

          {/* Interactive Instructions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '1.25rem',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              gap: '0.5rem',
            }}
          >
            <span style={{ color: 'var(--gold-400)' }}>◄</span>
            <span>Drag slider or use Keyboard Left / Right arrow keys</span>
            <span style={{ color: 'var(--gold-400)' }}>►</span>
          </div>
        </div>
      </div>
    </section>
  );
};

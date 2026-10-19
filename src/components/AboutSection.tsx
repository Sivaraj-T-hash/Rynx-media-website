import React from 'react';
import { Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import logoImg from '../assets/logo.jpeg';

export const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      style={{
        paddingTop: '6.5rem',
        paddingBottom: '6.5rem',
        backgroundColor: '#060609',
        position: 'relative',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3.5rem',
            alignItems: 'center',
          }}
          className="about-grid"
        >
          {/* Visual Showcase Card */}
          <div
            style={{
              position: 'relative',
            }}
          >
            <div
              className="card-glass"
              style={{
                borderRadius: '1.5rem',
                overflow: 'hidden',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                backgroundColor: '#0b0b12',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.95), 0 0 35px rgba(212, 175, 55, 0.12)',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=900&auto=format&fit=crop"
                alt="RYNX Studio Suite"
                style={{
                  width: '100%',
                  height: '420px',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(6,6,9,0.2) 0%, rgba(6,6,9,0.85) 100%)',
                }}
              />

              {/* Inset Brand Overlay */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '2rem',
                  left: '2rem',
                  right: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <img
                  src={logoImg}
                  alt="RYNX Logo"
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '12px',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)',
                    objectFit: 'cover',
                  }}
                />
                <div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                    Rise Your Next Level
                  </h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--gold-300)' }}>
                    Bespoke Video Post-Production & Color Studio
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Editorial Text */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1rem' }}>
              <span className="badge-gold">
                <Sparkles size={12} /> The Creative Vision
              </span>
            </div>

            <h2
              className="editorial-title"
              style={{
                fontSize: 'clamp(2rem, 3.5vw, 2.85rem)',
                marginBottom: '1.25rem',
                lineHeight: 1.15,
              }}
            >
              We Build The Visual World <span className="text-gold-gradient">Your Story Deserves.</span>
            </h2>

            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              At <strong>RYNX Digital Media</strong>, we believe editing isn't merely an assembly line—it is the final rewrite of your story. In an era where viewers scroll past hundreds of videos every hour, ordinary edits disappear into digital noise.
            </p>

            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.75rem' }}>
              Our editors combine psychological retention design, precision sound Foley, and Hollywood-grade DaVinci Resolve color grading to produce visuals that captivate audiences and elevate creator and brand equity.
            </p>

            {/* Core Tenets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <CheckCircle size={18} color="var(--gold-400)" />
                <span style={{ fontSize: '0.94rem', color: '#e0e0ea', fontWeight: 500 }}>
                  Every cut justified by viewer psychology and emotional pacing
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <CheckCircle size={18} color="var(--gold-400)" />
                <span style={{ fontSize: '0.94rem', color: '#e0e0ea', fontWeight: 500 }}>
                  Bespoke typography, soundscapes, and color grading for every creator
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <CheckCircle size={18} color="var(--gold-400)" />
                <span style={{ fontSize: '0.94rem', color: '#e0e0ea', fontWeight: 500 }}>
                  Transparent workflow with rapid iterations and dedicated editor communication
                </span>
              </div>
            </div>

            <div>
              <a href="#contact" className="btn btn-primary">
                <span>Start Collaborating With RYNX</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .about-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

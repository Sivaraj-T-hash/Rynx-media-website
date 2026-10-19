import React from 'react';
import { ArrowUpRight, Play } from 'lucide-react';
import { InstagramIcon } from './SocialIcons';
import { CONTACT_CONFIG } from '../config/contactConfig';

export const InstagramShowcase: React.FC = () => {
  // Selected Instagram visual highlights (configurable sample reels)
  const instagramReels = [
    {
      id: 'ig-1',
      title: 'Cinematic Hyperlapse Sequence',
      aspect: '9:16',
      thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop',
      views: 'Selected Cut',
    },
    {
      id: 'ig-2',
      title: 'Sound Design Breakdown',
      aspect: '9:16',
      thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=600&auto=format&fit=crop',
      views: 'BTS Edit',
    },
    {
      id: 'ig-3',
      title: 'LOG to Rec.709 Color Grade',
      aspect: '9:16',
      thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=600&auto=format&fit=crop',
      views: 'Color Pass',
    },
    {
      id: 'ig-4',
      title: 'Speed Ramp & Whip-Pan Hooks',
      aspect: '9:16',
      thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop',
      views: 'Retention Edit',
    },
  ];

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
            Catch daily behind-the-scenes editing breakdowns, sound design experiments, and short-form cuts on our official Instagram.
          </p>
        </div>

        {/* Selected Reel Showcase Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}
          className="ig-grid"
        >
          {instagramReels.map((reel) => (
            <a
              key={reel.id}
              href={CONTACT_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="card-glass"
              style={{
                borderRadius: '1.25rem',
                overflow: 'hidden',
                position: 'relative',
                aspectRatio: '9/16',
                display: 'block',
                textDecoration: 'none',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <img
                src={reel.thumbnail}
                alt={reel.title}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.4s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              />

              {/* Gradient Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.75) 100%)',
                }}
              />

              {/* Top Instagram Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '0.85rem',
                  right: '0.85rem',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0,0,0,0.65)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(6px)',
                }}
              >
                <InstagramIcon size={16} color="var(--gold-400)" />
              </div>

              {/* Play Icon */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(12, 12, 18, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  <Play size={18} fill="#ffffff" color="#ffffff" style={{ marginLeft: '2px' }} />
                </div>
              </div>

              {/* Bottom Reel Caption */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '1rem',
                  right: '1rem',
                }}
              >
                <span className="badge-dark" style={{ fontSize: '0.68rem', marginBottom: '0.4rem' }}>
                  {reel.views}
                </span>
                <p style={{ fontSize: '0.86rem', color: '#ffffff', fontWeight: 600, lineHeight: 1.3 }}>
                  {reel.title}
                </p>
              </div>
            </a>
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
        @media (max-width: 640px) {
          .ig-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
};

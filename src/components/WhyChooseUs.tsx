import React from 'react';
import { Sparkles, Compass, MessageSquare, Sliders, Users, CheckCircle, ShieldCheck } from 'lucide-react';
import { WHY_CHOOSE_ITEMS, type WhyChooseItem } from '../data/siteData';

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles size={24} />,
  Compass: <Compass size={24} />,
  MessageSquare: <MessageSquare size={24} />,
  Sliders: <Sliders size={24} />,
  Users: <Users size={24} />,
  CheckCircle: <CheckCircle size={24} />,
};

export const WhyChooseUs: React.FC = () => {
  return (
    <section
      id="why-us"
      style={{
        paddingTop: '6.5rem',
        paddingBottom: '6.5rem',
        backgroundColor: '#07070b',
        position: 'relative',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <span className="badge-gold">
              <ShieldCheck size={12} /> The RYNX Standard
            </span>
          </div>

          <h2 className="editorial-title">Why Creators & Brands Choose RYNX</h2>

          <p>
            We merge cinematic post-production craftsmanship with audience retention mechanics. No templates, no shortcuts.
          </p>
        </div>

        {/* 6 Differentiators Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '1.75rem',
          }}
          className="why-grid"
        >
          {WHY_CHOOSE_ITEMS.map((item: WhyChooseItem) => {
            const icon = iconMap[item.icon] || <Sparkles size={24} />;

            return (
              <div
                key={item.id}
                className="card-glass"
                style={{
                  padding: '2.25rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'rgba(15, 15, 22, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '1.35rem',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Top Corner Subtle Glow */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-30px',
                    right: '-30px',
                    width: '100px',
                    height: '100px',
                    background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                  }}
                />

                {/* Icon & Highlight Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(212, 175, 55, 0.12)',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      color: 'var(--gold-400)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {icon}
                  </div>

                  <span className="badge-dark" style={{ fontSize: '0.72rem' }}>
                    {item.highlight}
                  </span>
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontSize: '1.28rem',
                    fontWeight: 700,
                    marginBottom: '0.85rem',
                    color: '#ffffff',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {item.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: '0.94rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                  }}
                >
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .why-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

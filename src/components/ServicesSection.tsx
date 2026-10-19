import React from 'react';
import {
  Smartphone,
  Zap,
  Mic,
  Megaphone,
  Briefcase,
  Layers,
  Subtitles,
  Palette,
  Share2,
  Check,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { YoutubeIcon } from './SocialIcons';
import { SERVICES_DATA, type ServiceItem } from '../data/servicesData';
import { getServiceEnquiryUrl } from '../config/contactConfig';

// Map icon strings to Lucide components
const iconMap: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone size={24} />,
  Youtube: <YoutubeIcon size={24} />,
  Zap: <Zap size={24} />,
  Mic: <Mic size={24} />,
  Megaphone: <Megaphone size={24} />,
  Briefcase: <Briefcase size={24} />,
  Layers: <Layers size={24} />,
  Subtitles: <Subtitles size={24} />,
  Palette: <Palette size={24} />,
  Share2: <Share2 size={24} />,
};

export const ServicesSection: React.FC = () => {
  return (
    <section
      id="services"
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
              <Sparkles size={12} /> Comprehensive Post-Production
            </span>
          </div>

          <h2 className="editorial-title">Editing Built Around Your Vision.</h2>

          <p>
            From viral vertical reels to boardroom-ready commercials, our post-production pipeline delivers speed, storytelling, and cinematic polish.
          </p>
        </div>

        {/* 10 Service Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '1.75rem',
          }}
          className="services-grid"
        >
          {SERVICES_DATA.map((service: ServiceItem) => {
            const iconComponent = iconMap[service.icon] || <Layers size={24} />;

            return (
              <div
                key={service.id}
                className="card-glass"
                style={{
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '1.35rem',
                  backgroundColor: 'rgba(15, 15, 22, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  position: 'relative',
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {/* Header: Icon + Category Badge */}
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
                      boxShadow: '0 0 20px rgba(212, 175, 55, 0.1)',
                    }}
                  >
                    {iconComponent}
                  </div>

                  {service.badge ? (
                    <span className="badge-gold" style={{ fontSize: '0.72rem' }}>
                      {service.badge}
                    </span>
                  ) : (
                    <span className="badge-dark" style={{ fontSize: '0.72rem' }}>
                      {service.category}
                    </span>
                  )}
                </div>

                {/* Service Title */}
                <h3
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    marginBottom: '0.85rem',
                    color: '#ffffff',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {service.title}
                </h3>

                {/* Service Description */}
                <p
                  style={{
                    fontSize: '0.92rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    marginBottom: '1.5rem',
                  }}
                >
                  {service.shortDescription}
                </p>

                {/* Features Checklist */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    marginBottom: '2rem',
                    marginTop: 'auto',
                  }}
                >
                  {service.features.map((feature, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        fontSize: '0.85rem',
                        color: '#d4d4dc',
                      }}
                    >
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(212, 175, 55, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Check size={10} color="var(--gold-400)" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Enquire CTA Button */}
                <div style={{ paddingTop: '1.15rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <a
                    href={getServiceEnquiryUrl(service.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '0.75rem 1.25rem',
                      fontSize: '0.86rem',
                    }}
                  >
                    <MessageCircle size={16} />
                    <span>Enquire Now</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .services-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

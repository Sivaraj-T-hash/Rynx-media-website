import React, { useState, useEffect } from 'react';
import { Star, MessageSquareQuote, Sparkles } from 'lucide-react';
import type { DbTestimonial } from '../types/database';
import { testimonialsService } from '../services/testimonialsService';

export const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<DbTestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadTestimonials() {
      setLoading(true);
      try {
        const data = await testimonialsService.getPublishedTestimonials();
        if (isMounted) {
          setTestimonials(data);
        }
      } catch (err) {
        console.warn('Testimonials load notice:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadTestimonials();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      id="testimonials"
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
              <Sparkles size={12} /> Feedback & Endorsements
            </span>
          </div>

          <h2 className="editorial-title">What Our Clients Say</h2>

          <p>
            Insights from creators, production heads, and brand directors who rely on RYNX for their video post-production.
          </p>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                border: '3px solid rgba(212, 175, 55, 0.2)',
                borderTopColor: 'var(--gold-400)',
                borderRadius: '50%',
                margin: '0 auto 1rem auto',
                animation: 'spin 0.8s linear infinite',
              }}
            />
          </div>
        )}

        {/* Empty State when no published testimonials exist */}
        {!loading && testimonials.length === 0 && (
          <div
            className="card-glass"
            style={{
              maxWidth: '560px',
              margin: '0 auto',
              padding: '2.5rem 2rem',
              textAlign: 'center',
              backgroundColor: 'rgba(15, 15, 22, 0.55)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '1.25rem',
            }}
          >
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontStyle: 'italic' }}>
              No client testimonials yet.
            </p>
          </div>
        )}

        {/* Real Testimonials Grid */}
        {!loading && testimonials.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.75rem',
            }}
            className="testimonials-grid"
          >
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="card-glass"
                style={{
                  padding: '2.25rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '1.25rem',
                  backgroundColor: 'rgba(15, 15, 22, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  position: 'relative',
                }}
              >
                {/* Star Rating & Quote Icon */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} size={16} fill="var(--gold-400)" color="var(--gold-400)" />
                    ))}
                  </div>

                  <MessageSquareQuote size={28} color="rgba(212, 175, 55, 0.3)" />
                </div>

                {/* Quote Content */}
                <blockquote
                  style={{
                    fontSize: '0.96rem',
                    color: '#e2e2ec',
                    lineHeight: 1.65,
                    marginBottom: '2rem',
                    fontStyle: 'italic',
                  }}
                >
                  "{item.testimonial_text}"
                </blockquote>

                {/* Client Info Footer */}
                <div
                  style={{
                    marginTop: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  {item.profile_photo_url && (
                    <img
                      src={item.profile_photo_url}
                      alt={item.client_name}
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '1px solid rgba(212, 175, 55, 0.35)',
                      }}
                    />
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.94rem', fontWeight: 700, color: '#ffffff' }}>
                      {item.client_name}
                    </span>
                    {item.client_designation && (
                      <span style={{ fontSize: '0.78rem', color: 'var(--gold-300)' }}>
                        {item.client_designation}
                      </span>
                    )}
                    {item.company_name && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {item.company_name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .testimonials-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

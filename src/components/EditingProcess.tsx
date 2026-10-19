import React from 'react';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { PROCESS_STEPS, type ProcessStep } from '../data/siteData';

export const EditingProcess: React.FC = () => {
  return (
    <section
      id="process"
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
              <Sparkles size={12} /> Frictionless Workflow
            </span>
          </div>

          <h2 className="editorial-title">Our Editing Process</h2>

          <p>
            From the moment you upload raw clips to the final broadcast delivery, our four-stage framework ensures zero miscommunication and rapid turnarounds.
          </p>
        </div>

        {/* Process Step Grid / Timeline */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            position: 'relative',
          }}
          className="process-grid"
        >
          {PROCESS_STEPS.map((step: ProcessStep) => {
            return (
              <div
                key={step.step}
                className="card-glass"
                style={{
                  padding: '2.25rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'rgba(15, 15, 22, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '1.25rem',
                  position: 'relative',
                }}
              >
                {/* Step Number Top Row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    marginBottom: '1.5rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '2.5rem',
                      fontWeight: 800,
                      background: 'var(--gradient-gold)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      lineHeight: 1,
                    }}
                  >
                    {step.step}
                  </span>

                  <span className="badge-dark" style={{ fontSize: '0.72rem' }}>
                    {step.number}
                  </span>
                </div>

                {/* Step Title */}
                <h3
                  style={{
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    marginBottom: '0.85rem',
                    color: '#ffffff',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {step.title}
                </h3>

                {/* Step Description */}
                <p
                  style={{
                    fontSize: '0.92rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    marginBottom: '1.75rem',
                  }}
                >
                  {step.description}
                </p>

                {/* Step Deliverables / Details Checklist */}
                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem',
                  }}
                >
                  {step.details.map((detail, dIdx) => (
                    <div
                      key={dIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.82rem',
                        color: '#b8b8c5',
                      }}
                    >
                      <Check size={12} color="var(--gold-400)" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Timeline Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
          <a
            href="#contact"
            className="btn btn-primary"
            style={{ padding: '0.85rem 2.25rem' }}
          >
            <span>Start Phase 01: Share Your Brief</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .process-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

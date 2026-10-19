import React from 'react';
import { ArrowUp, Mail, MessageCircle } from 'lucide-react';
import { InstagramIcon } from './SocialIcons';
import { CONTACT_CONFIG, getWhatsAppUrl } from '../config/contactConfig';
import { SERVICES_DATA } from '../data/servicesData';
import logoImg from '../assets/logo.jpeg';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Featured Portfolio', href: '#portfolio' },
    { label: 'Editing Services', href: '#services' },
    { label: 'The RYNX Standard', href: '#why-us' },
    { label: 'Workflow Process', href: '#process' },
    { label: 'Raw vs Final Edit', href: '#comparison' },
    { label: 'Client Feedback', href: '#testimonials' },
    { label: 'FAQs', href: '#faq' },
    { label: 'Contact Us', href: '#contact' },
  ];

  return (
    <footer
      style={{
        backgroundColor: '#040406',
        borderTop: '1px solid rgba(212, 175, 55, 0.15)',
        paddingTop: '5rem',
        paddingBottom: '2.5rem',
        position: 'relative',
        color: 'var(--text-secondary)',
      }}
    >
      <div className="container">
        {/* Top Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
            gap: '3rem',
            marginBottom: '4rem',
          }}
          className="footer-grid"
        >
          {/* Brand Column */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <img
                src={logoImg}
                alt="RYNX Digital Media"
                style={{
                  height: '48px',
                  width: 'auto',
                  borderRadius: '10px',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  boxShadow: '0 0 20px rgba(212, 175, 55, 0.2)',
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    color: '#ffffff',
                  }}
                >
                  RYN<span style={{ color: 'var(--gold-400)' }}>X</span>
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--gold-400)',
                    fontWeight: 600,
                  }}
                >
                  Digital Media
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.92rem', color: '#9d9da8', lineHeight: 1.6, marginBottom: '1.5rem', maxWidth: '340px' }}>
              A boutique digital video post-production agency turning raw footage into cinematic visual narratives that command audience attention.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold-400)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(37, 211, 102, 0.2)';
                  e.currentTarget.style.borderColor = '#25D366';
                  e.currentTarget.style.color = '#25D366';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = 'var(--gold-400)';
                }}
              >
                <MessageCircle size={18} />
              </a>

              <a
                href={CONTACT_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold-400)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(225, 48, 108, 0.2)';
                  e.currentTarget.style.borderColor = '#E1306C';
                  e.currentTarget.style.color = '#E1306C';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = 'var(--gold-400)';
                }}
              >
                <InstagramIcon size={18} />
              </a>

              <a
                href={`mailto:${CONTACT_CONFIG.email}`}
                aria-label="Email"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold-400)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.2)';
                  e.currentTarget.style.borderColor = 'var(--gold-400)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
              Navigation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {navLinks.slice(0, 5).map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Editing Services */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
              Services
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {SERVICES_DATA.slice(0, 5).map((s) => (
                <a
                  key={s.id}
                  href="#services"
                  style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  {s.title}
                </a>
              ))}
            </div>
          </div>

          {/* Agency Tagline & Hours */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
              Studio Hours
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#c4c4cf', lineHeight: 1.6, marginBottom: '0.85rem' }}>
              {CONTACT_CONFIG.availability}
            </p>
            <p style={{ fontSize: '0.82rem', color: 'var(--gold-400)' }}>
              Dedicated project turnaround with real-time Slack and WhatsApp collaboration.
            </p>

            <div style={{ marginTop: '1.5rem' }}>
              <button
                onClick={scrollToTop}
                className="btn btn-secondary"
                style={{ fontSize: '0.82rem', padding: '0.55rem 1.15rem', gap: '0.45rem' }}
              >
                <span>Back to Top</span>
                <ArrowUp size={14} color="var(--gold-400)" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            © {currentYear} {CONTACT_CONFIG.agencyName}. All rights reserved. {CONTACT_CONFIG.tagline}.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span>Crafted for high-performance creative storytelling</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 580px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
};

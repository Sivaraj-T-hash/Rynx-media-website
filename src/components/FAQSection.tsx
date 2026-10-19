import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQ_DATA, type FAQItem } from '../data/siteData';

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(FAQ_DATA[0]?.id || null);

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
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
              <HelpCircle size={12} /> Clear Answers
            </span>
          </div>

          <h2 className="editorial-title">Frequently Asked Questions</h2>

          <p>
            Everything you need to know about partnering with RYNX for your video editing and production needs.
          </p>
        </div>

        {/* Accordion Container */}
        <div
          style={{
            maxWidth: '860px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {FAQ_DATA.map((item: FAQItem) => {
            const isOpen = openId === item.id;

            return (
              <div
                key={item.id}
                style={{
                  borderRadius: '1rem',
                  backgroundColor: isOpen ? 'rgba(20, 20, 30, 0.75)' : 'rgba(14, 14, 20, 0.55)',
                  border: isOpen ? '1px solid var(--border-gold-subtle)' : '1px solid rgba(255, 255, 255, 0.07)',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                }}
              >
                {/* Accordion Header / Trigger Button */}
                <button
                  onClick={() => toggleFAQ(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  style={{
                    width: '100%',
                    padding: '1.35rem 1.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    background: 'none',
                    border: 'none',
                    color: '#ffffff',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.08rem',
                    fontWeight: 600,
                    outline: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isOpen) e.currentTarget.style.color = 'var(--gold-300)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isOpen) e.currentTarget.style.color = '#ffffff';
                  }}
                >
                  <span style={{ color: isOpen ? 'var(--gold-300)' : '#ffffff' }}>
                    {item.question}
                  </span>

                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isOpen ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'transform 0.3s ease',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      color: isOpen ? 'var(--gold-400)' : 'var(--text-muted)',
                    }}
                  >
                    <ChevronDown size={18} />
                  </div>
                </button>

                {/* Accordion Answer Content */}
                {isOpen && (
                  <div
                    id={`faq-answer-${item.id}`}
                    role="region"
                    style={{
                      padding: '0 1.75rem 1.5rem 1.75rem',
                      color: 'var(--text-secondary)',
                      fontSize: '0.94rem',
                      lineHeight: 1.65,
                      borderTop: '1px solid rgba(255, 255, 255, 0.04)',
                      paddingTop: '1rem',
                      animation: 'fadeIn 0.25s ease-out',
                    }}
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

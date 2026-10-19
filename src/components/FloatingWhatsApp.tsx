import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../config/contactConfig';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 90,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}
    >
      {/* Tooltip Popup */}
      {showTooltip && (
        <div
          style={{
            backgroundColor: 'rgba(15, 15, 22, 0.95)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '999px',
            padding: '0.5rem 1rem',
            color: '#ffffff',
            fontSize: '0.82rem',
            fontWeight: 600,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            whiteSpace: 'nowrap',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          Chat with an Editor on WhatsApp
        </div>
      )}

      {/* Action Button */}
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with an Editor on WhatsApp"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className="floating-wa-btn"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 25px rgba(37, 211, 102, 0.45)',
          textDecoration: 'none',
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease',
          outline: 'none',
        }}
      >
        <MessageCircle size={28} />
      </a>
      <style>{`
        .floating-wa-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 30px rgba(37, 211, 102, 0.6) !important;
        }
      `}</style>
    </div>
  );
};

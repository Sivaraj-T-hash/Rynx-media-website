import React from 'react';
import {
  LayoutDashboard,
  Film,
  Tags,
  MessageSquareQuote,
  Inbox,
  SlidersHorizontal,
  Settings,
  BarChart3,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import logoImg from '../../assets/logo.jpeg';

export type AdminTab =
  | 'dashboard'
  | 'portfolio'
  | 'categories'
  | 'testimonials'
  | 'enquiries'
  | 'before_after'
  | 'settings'
  | 'analytics';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onLogout: () => void;
  newEnquiriesCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  onLogout,
  newEnquiriesCount = 0,
}) => {
  const menuItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'portfolio', label: 'Portfolio', icon: <Film size={18} /> },
    { id: 'categories', label: 'Categories', icon: <Tags size={18} /> },
    { id: 'testimonials', label: 'Testimonials', icon: <MessageSquareQuote size={18} /> },
    { id: 'enquiries', label: 'Enquiries', icon: <Inbox size={18} />, badge: newEnquiriesCount },
    { id: 'before_after', label: 'Before & After', icon: <SlidersHorizontal size={18} /> },
    { id: 'settings', label: 'Website Settings', icon: <Settings size={18} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
  ];

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: '#0a0a0f',
        borderRight: '1px solid rgba(212, 175, 55, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <img
          src={logoImg}
          alt="RYNX"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: '1px solid rgba(212, 175, 55, 0.3)',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.04em' }}>
            RYN<span style={{ color: 'var(--gold-400)' }}>X</span> CMS
          </span>
          <span style={{ fontSize: '0.65rem', color: 'var(--gold-400)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Studio Admin
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', overflowY: 'auto' }}>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                border: isActive ? '1px solid var(--border-gold-subtle)' : '1px solid transparent',
                backgroundColor: isActive ? 'rgba(212, 175, 55, 0.12)' : 'transparent',
                color: isActive ? 'var(--gold-300)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.88rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {item.icon}
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span
                  style={{
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '999px',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer Actions */}
      <div
        style={{
          padding: '1rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.65rem 0.85rem',
            borderRadius: '0.65rem',
            color: 'var(--text-muted)',
            fontSize: '0.82rem',
            textDecoration: 'none',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <span>View Live Site</span>
          <ExternalLink size={14} />
        </a>

        <button
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.65rem 0.85rem',
            borderRadius: '0.65rem',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#fca5a5',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            width: '100%',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.16)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)')}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

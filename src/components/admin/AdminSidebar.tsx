import React, { useEffect } from 'react';
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
  X,
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
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  onLogout,
  newEnquiriesCount = 0,
  isOpenMobile = false,
  onCloseMobile,
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

  // Close mobile drawer on Escape key
  useEffect(() => {
    if (!isOpenMobile) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseMobile?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpenMobile, onCloseMobile]);

  const handleItemClick = (id: AdminTab) => {
    onSelectTab(id);
    onCloseMobile?.();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className="admin-sidebar-backdrop"
        onClick={onCloseMobile}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 998,
          transition: 'opacity 0.3s ease, visibility 0.3s ease',
          opacity: isOpenMobile ? 1 : 0,
          visibility: isOpenMobile ? 'visible' : 'hidden',
          pointerEvents: isOpenMobile ? 'auto' : 'none',
        }}
      />

      <aside
        className={`admin-sidebar-container ${isOpenMobile ? 'drawer-open' : ''}`}
        aria-label="Admin Navigation Sidebar"
        style={{
          width: '260px',
          backgroundColor: '#0a0a0f',
          borderRight: '1px solid rgba(212, 175, 55, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          zIndex: 999,
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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

          {/* Close button visible on mobile */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="mobile-sidebar-close-btn"
            aria-label="Close navigation menu"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.35rem',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav
          style={{
            flex: 1,
            padding: '1rem 0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            overflowY: 'auto',
          }}
        >
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item.id)}
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
                  minHeight: '44px',
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
              minHeight: '40px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <span>View Live Site</span>
            <ExternalLink size={14} />
          </a>

          <button
            type="button"
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
              minHeight: '44px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.16)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)')}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <style>{`
        @media (min-width: 1024px) {
          .admin-sidebar-container {
            position: sticky !important;
            top: 0 !important;
            transform: none !important;
          }
          .admin-sidebar-backdrop {
            display: none !important;
          }
          .mobile-sidebar-close-btn {
            display: none !important;
          }
        }
        @media (max-width: 1023px) {
          .admin-sidebar-container {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            bottom: 0 !important;
            max-width: 290px;
            width: 82vw !important;
            transform: translateX(-100%);
            box-shadow: 10px 0 30px rgba(0, 0, 0, 0.85);
          }
          .admin-sidebar-container.drawer-open {
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </>
  );
};

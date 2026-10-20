import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { authService } from '../services/authService';
import { AdminSidebar, type AdminTab } from '../components/admin/AdminSidebar';
import { AdminOverview } from '../components/admin/AdminOverview';
import { AdminPortfolio } from '../components/admin/AdminPortfolio';
import { AdminCategories } from '../components/admin/AdminCategories';
import { AdminTestimonials } from '../components/admin/AdminTestimonials';
import { AdminEnquiries } from '../components/admin/AdminEnquiries';
import { AdminBeforeAfter } from '../components/admin/AdminBeforeAfter';
import { AdminSettings } from '../components/admin/AdminSettings';
import { AdminAnalytics } from '../components/admin/AdminAnalytics';
import { enquiriesService } from '../services/enquiriesService';
import logoImg from '../assets/logo.jpeg';

const TAB_TITLES: Record<AdminTab, string> = {
  dashboard: 'Production Overview',
  portfolio: 'Portfolio Videos',
  categories: 'Categories',
  testimonials: 'Testimonials',
  enquiries: 'Client Enquiries',
  before_after: 'Before & After',
  settings: 'Website Settings',
  analytics: 'Lead Analytics',
};

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [newEnquiriesCount, setNewEnquiriesCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Protected route check
  useEffect(() => {
    let isMounted = true;

    async function verifyAuth() {
      try {
        const session = await authService.getSession();
        if (!session?.user) {
          if (isMounted) navigate('/admin/login', { replace: true });
          return;
        }

        const isAdmin = await authService.checkIsAdmin(session.user.id);
        if (!isAdmin) {
          await authService.signOut();
          if (isMounted) navigate('/admin/login', { replace: true });
          return;
        }

        // Fetch new enquiries count for sidebar badge
        try {
          const enqs = await enquiriesService.getEnquiriesAdmin({ status: 'New' });
          if (isMounted) setNewEnquiriesCount(enqs.length);
        } catch {
          // Ignore
        }
      } catch (err) {
        console.warn('Auth check error:', err);
        if (isMounted) navigate('/admin/login', { replace: true });
      } finally {
        if (isMounted) setCheckingAuth(false);
      }
    }

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authService.signOut();
    } catch {
      // Ignore
    }
    navigate('/admin/login', { replace: true });
  };

  if (checkingAuth) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#060609',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(212, 175, 55, 0.2)',
              borderTopColor: 'var(--gold-400)',
              borderRadius: '50%',
              margin: '0 auto 1rem auto',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <p style={{ fontSize: '0.9rem' }}>Verifying Administrator Authorization...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      className="admin-dashboard-layout"
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#07070b',
        color: 'var(--text-primary)',
        position: 'relative',
        width: '100%',
        overflowX: 'hidden',
      }}
    >
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onLogout={handleLogout}
        newEnquiriesCount={newEnquiriesCount}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area with Mobile Top Bar */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          backgroundColor: '#07070b',
        }}
      >
        {/* Sticky Mobile Top Header Bar */}
        <header
          className="admin-mobile-topbar"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backgroundColor: 'rgba(10, 10, 15, 0.95)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
            padding: '0.75rem 1rem',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                color: 'var(--gold-400)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <Menu size={22} />
              {newEnquiriesCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#ef4444',
                    border: '2px solid #07070b',
                  }}
                />
              )}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img
                src={logoImg}
                alt="RYNX"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                }}
              />
              <span style={{ fontSize: '0.98rem', fontWeight: 800, color: '#ffffff' }}>
                RYN<span style={{ color: 'var(--gold-400)' }}>X</span>
              </span>
            </div>
          </div>

          <span
            className="badge-dark"
            style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              padding: '0.3rem 0.65rem',
              color: 'var(--gold-300)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              maxWidth: '140px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {TAB_TITLES[activeTab]}
          </span>
        </header>

        {/* Scrollable Main Area */}
        <main
          className="admin-main-content"
          style={{
            flex: 1,
            overflowY: 'auto',
            width: '100%',
          }}
        >
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              width: '100%',
            }}
          >
            {activeTab === 'dashboard' && <AdminOverview onNavigateTab={setActiveTab} />}
            {activeTab === 'portfolio' && <AdminPortfolio />}
            {activeTab === 'categories' && <AdminCategories />}
            {activeTab === 'testimonials' && <AdminTestimonials />}
            {activeTab === 'enquiries' && <AdminEnquiries />}
            {activeTab === 'before_after' && <AdminBeforeAfter />}
            {activeTab === 'settings' && <AdminSettings />}
            {activeTab === 'analytics' && <AdminAnalytics />}
          </div>
        </main>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .admin-mobile-topbar {
            display: none !important;
          }
          .admin-main-content {
            padding: 2.5rem;
            max-height: 100vh;
          }
        }
        @media (max-width: 1023px) {
          .admin-mobile-topbar {
            display: flex !important;
          }
          .admin-main-content {
            padding: 1.25rem 1rem;
            min-height: calc(100vh - 60px);
          }
        }
      `}</style>
    </div>
  );
};

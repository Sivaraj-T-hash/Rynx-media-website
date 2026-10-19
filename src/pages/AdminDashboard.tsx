import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [newEnquiriesCount, setNewEnquiriesCount] = useState(0);

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
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#07070b',
        color: 'var(--text-primary)',
      }}
    >
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onLogout={handleLogout}
        newEnquiriesCount={newEnquiriesCount}
      />

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          padding: '2.5rem',
          overflowY: 'auto',
          maxHeight: '100vh',
          backgroundColor: '#07070b',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
  );
};

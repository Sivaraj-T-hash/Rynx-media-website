import React, { useEffect, useState } from 'react';
import {
  Film,
  Tags,
  MessageSquareQuote,
  Inbox,
  ArrowRight,
  TrendingUp,
  MessageCircle,
  Mail,
} from 'lucide-react';
import type { AnalyticsSummary } from '../../services/analyticsService';
import { analyticsService } from '../../services/analyticsService';
import type { DbEnquiry } from '../../types/database';
import { enquiriesService } from '../../services/enquiriesService';
import type { AdminTab } from './AdminSidebar';

interface AdminOverviewProps {
  onNavigateTab: (tab: AdminTab) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigateTab }) => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [recentEnquiries, setRecentEnquiries] = useState<DbEnquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOverview() {
      setLoading(true);
      try {
        const [sum, enqs] = await Promise.all([
          analyticsService.getSummary(),
          enquiriesService.getEnquiriesAdmin(),
        ]);
        setSummary(sum);
        setRecentEnquiries(enqs.slice(0, 5));
      } catch (err) {
        console.warn('Overview load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOverview();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return { bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444', text: '#fca5a5' };
      case 'Contacted':
        return { bg: 'rgba(59, 130, 246, 0.15)', border: '#3b82f6', text: '#93c5fd' };
      case 'In Progress':
        return { bg: 'rgba(234, 179, 8, 0.15)', border: '#eab308', text: '#fef08a' };
      case 'Closed':
        return { bg: 'rgba(34, 197, 94, 0.15)', border: '#22c55e', text: '#86efac' };
      default:
        return { bg: 'rgba(255, 255, 255, 0.1)', border: 'rgba(255, 255, 255, 0.2)', text: '#ffffff' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
            Production Overview
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Real-time operational metrics and enquiry pipeline from Supabase.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => onNavigateTab('portfolio')}
            className="btn btn-primary"
            style={{ fontSize: '0.84rem', padding: '0.6rem 1.25rem' }}
          >
            <Film size={15} />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Operational Metrics Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {/* Published Projects */}
        <div
          className="card-glass"
          style={{ padding: '1.5rem', backgroundColor: 'rgba(15, 15, 22, 0.75)', cursor: 'pointer' }}
          onClick={() => onNavigateTab('portfolio')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Published Projects
            </span>
            <Film size={18} color="var(--gold-400)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
            {loading ? '...' : summary?.publishedProjectsCount || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            of {summary?.totalProjectsCount || 0} total in database
          </span>
        </div>

        {/* Categories */}
        <div
          className="card-glass"
          style={{ padding: '1.5rem', backgroundColor: 'rgba(15, 15, 22, 0.75)', cursor: 'pointer' }}
          onClick={() => onNavigateTab('categories')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Categories
            </span>
            <Tags size={18} color="var(--gold-400)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
            {loading ? '...' : summary?.categoriesCount || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Excluding virtual "All" filter
          </span>
        </div>

        {/* Published Testimonials */}
        <div
          className="card-glass"
          style={{ padding: '1.5rem', backgroundColor: 'rgba(15, 15, 22, 0.75)', cursor: 'pointer' }}
          onClick={() => onNavigateTab('testimonials')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Testimonials
            </span>
            <MessageSquareQuote size={18} color="var(--gold-400)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
            {loading ? '...' : summary?.publishedTestimonialsCount || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Live client reviews
          </span>
        </div>

        {/* Total Enquiries */}
        <div
          className="card-glass"
          style={{ padding: '1.5rem', backgroundColor: 'rgba(15, 15, 22, 0.75)', cursor: 'pointer' }}
          onClick={() => onNavigateTab('enquiries')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Enquiries
            </span>
            <Inbox size={18} color="var(--gold-400)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
            {loading ? '...' : summary?.totalEnquiriesCount || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#fca5a5', fontWeight: 600 }}>
            {summary?.newEnquiriesCount || 0} New Pending Action
          </span>
        </div>
      </div>

      {/* Enquiry Pipeline Status Breakdown */}
      <div
        className="card-glass"
        style={{ padding: '1.75rem', backgroundColor: 'rgba(15, 15, 22, 0.8)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} color="var(--gold-400)" />
            <span>Enquiry Status Pipeline</span>
          </h2>
          <button
            onClick={() => onNavigateTab('enquiries')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--gold-400)',
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span>Manage All Enquiries</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <span style={{ fontSize: '0.78rem', color: '#fca5a5', textTransform: 'uppercase', fontWeight: 600 }}>New</span>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', marginTop: '0.25rem' }}>
              {summary?.newEnquiriesCount || 0}
            </div>
          </div>

          <div style={{ padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <span style={{ fontSize: '0.78rem', color: '#93c5fd', textTransform: 'uppercase', fontWeight: 600 }}>Contacted</span>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', marginTop: '0.25rem' }}>
              {summary?.contactedEnquiriesCount || 0}
            </div>
          </div>

          <div style={{ padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'rgba(234, 179, 8, 0.08)', border: '1px solid rgba(234, 179, 8, 0.2)' }}>
            <span style={{ fontSize: '0.78rem', color: '#fef08a', textTransform: 'uppercase', fontWeight: 600 }}>In Progress</span>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', marginTop: '0.25rem' }}>
              {summary?.inProgressEnquiriesCount || 0}
            </div>
          </div>

          <div style={{ padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
            <span style={{ fontSize: '0.78rem', color: '#86efac', textTransform: 'uppercase', fontWeight: 600 }}>Closed</span>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', marginTop: '0.25rem' }}>
              {summary?.closedEnquiriesCount || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Enquiries List */}
      <div
        className="card-glass"
        style={{ padding: '1.75rem', backgroundColor: 'rgba(15, 15, 22, 0.8)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
            Recent Project Submissions
          </h2>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Showing latest 5 entries
          </span>
        </div>

        {recentEnquiries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
            <Inbox size={32} style={{ margin: '0 auto 0.75rem auto', opacity: 0.5 }} />
            <p style={{ fontSize: '0.9rem' }}>No project enquiries received yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentEnquiries.map((enq) => {
              const badge = getStatusBadge(enq.status);
              const waClean = enq.whatsapp_number.replace(/\D/g, '');

              return (
                <div
                  key={enq.id}
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '0.85rem',
                    backgroundColor: 'rgba(22, 22, 32, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
                        {enq.full_name}
                      </span>
                      {enq.brand_name && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--gold-400)' }}>
                          ({enq.brand_name})
                        </span>
                      )}
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '999px',
                          backgroundColor: badge.bg,
                          color: badge.text,
                          border: `1px solid ${badge.border}`,
                        }}
                      >
                        {enq.status}
                      </span>
                    </div>

                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      {enq.editing_type} • {enq.video_count || '1 video'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    {waClean && (
                      <a
                        href={`https://wa.me/${waClean}?text=${encodeURIComponent(`Hi ${enq.full_name}, thank you for reaching out to RYNX Digital Media regarding your video project!`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-whatsapp"
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}
                        title="Open WhatsApp chat"
                      >
                        <MessageCircle size={14} />
                        <span>Chat</span>
                      </a>
                    )}

                    <a
                      href={`mailto:${enq.email}?subject=RYNX Video Editing Enquiry - ${enq.full_name}`}
                      className="btn btn-secondary"
                      style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}
                      title="Send email"
                    >
                      <Mail size={14} />
                      <span>Email</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

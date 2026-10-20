import React, { useState, useEffect } from 'react';
import { TrendingUp, ShieldAlert } from 'lucide-react';
import type { AnalyticsSummary } from '../../services/analyticsService';
import { analyticsService } from '../../services/analyticsService';

export const AdminAnalytics: React.FC = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await analyticsService.getSummary();
        setSummary(data);
      } catch (err) {
        console.warn('Analytics load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalEnquiries = summary?.totalEnquiriesCount || 0;
  const closedEnquiries = summary?.closedEnquiriesCount || 0;
  const conversionRate = totalEnquiries > 0 ? Math.round((closedEnquiries / totalEnquiries) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
          Production & Lead Analytics
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Real operational telemetry derived directly from your Supabase production tables. No fabricated metrics.
        </p>
      </div>

      {/* Primary KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1.25rem' }}>
        <div className="card-glass" style={{ padding: 'clamp(1.2rem, 3vw, 1.75rem)', backgroundColor: 'rgba(15, 15, 22, 0.75)' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Lead-to-Project Conversion
          </span>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--gold-300)', marginTop: '0.35rem' }}>
            {loading ? '...' : `${conversionRate}%`}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {closedEnquiries} closed of {totalEnquiries} enquiries
          </span>
        </div>

        <div className="card-glass" style={{ padding: 'clamp(1.2rem, 3vw, 1.75rem)', backgroundColor: 'rgba(15, 15, 22, 0.75)' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lead Pipeline
          </span>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', marginTop: '0.35rem' }}>
            {loading ? '...' : (summary?.newEnquiriesCount || 0) + (summary?.contactedEnquiriesCount || 0) + (summary?.inProgressEnquiriesCount || 0)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#fca5a5' }}>
            {summary?.newEnquiriesCount || 0} requiring immediate contact
          </span>
        </div>

        <div className="card-glass" style={{ padding: 'clamp(1.2rem, 3vw, 1.75rem)', backgroundColor: 'rgba(15, 15, 22, 0.75)' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Portfolio Publishing Ratio
          </span>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', marginTop: '0.35rem' }}>
            {loading
              ? '...'
              : summary?.totalProjectsCount
              ? `${Math.round(((summary?.publishedProjectsCount || 0) / summary.totalProjectsCount) * 100)}%`
              : '0%'}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {summary?.publishedProjectsCount || 0} published / {summary?.totalProjectsCount || 0} total
          </span>
        </div>
      </div>

      {/* Enquiry Funnel Visualization */}
      <div className="card-glass" style={{ padding: 'clamp(1.2rem, 3vw, 2rem)', backgroundColor: 'rgba(15, 15, 22, 0.8)' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={18} color="var(--gold-400)" />
          <span>Real Enquiry Funnel Breakdown</span>
        </h2>

        {totalEnquiries === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
            No enquiries recorded yet. Once visitors submit briefs, real funnel distribution will populate here automatically.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { label: 'New (Unread / Pending Contact)', count: summary?.newEnquiriesCount || 0, color: '#ef4444' },
              { label: 'Contacted (Initial Discovery)', count: summary?.contactedEnquiriesCount || 0, color: '#3b82f6' },
              { label: 'In Progress (Active Editing Cut)', count: summary?.inProgressEnquiriesCount || 0, color: '#eab308' },
              { label: 'Closed (Completed / Retainer Active)', count: summary?.closedEnquiriesCount || 0, color: '#22c55e' },
            ].map((step) => {
              const pct = totalEnquiries > 0 ? Math.round((step.count / totalEnquiries) * 100) : 0;
              return (
                <div key={step.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <span style={{ color: '#ffffff', fontWeight: 600 }}>{step.label}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{step.count} ({pct}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', backgroundColor: step.color, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Telemetry Notice */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          borderRadius: '1rem',
          backgroundColor: 'rgba(212, 175, 55, 0.06)',
          border: '1px solid rgba(212, 175, 55, 0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          fontSize: '0.84rem',
          color: 'var(--text-secondary)',
        }}
      >
        <ShieldAlert size={20} color="var(--gold-400)" style={{ flexShrink: 0 }} />
        <span>
          Privacy-First Analytics: RYNX does not log intrusive visitor cookies or fabricate vanity metrics. Real counts update based strictly on authentic database records in PostgreSQL.
        </span>
      </div>
    </div>
  );
};

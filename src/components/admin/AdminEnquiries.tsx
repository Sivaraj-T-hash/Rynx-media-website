import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Search,
  MessageCircle,
  Mail,
  ExternalLink,
  Trash2,
  X,
} from 'lucide-react';
import type { DbEnquiry, EnquiryStatus } from '../../types/database';
import { enquiriesService } from '../../services/enquiriesService';

export const AdminEnquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<DbEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<EnquiryStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeEnquiry, setActiveEnquiry] = useState<DbEnquiry | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const data = await enquiriesService.getEnquiriesAdmin({
        status: selectedStatus,
        search: searchQuery,
      });
      setEnquiries(data);
    } catch (err) {
      console.warn('Error loading enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, [selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadEnquiries();
  };

  const openDetails = (enq: DbEnquiry) => {
    setActiveEnquiry(enq);
    setAdminNotes(enq.admin_notes || '');
  };

  const handleStatusChange = async (enqId: string, newStatus: EnquiryStatus) => {
    setUpdating(true);
    try {
      const updated = await enquiriesService.updateEnquiryStatus(enqId, newStatus, adminNotes);
      setActiveEnquiry(updated);
      setEnquiries((prev) => prev.map((e) => (e.id === enqId ? updated : e)));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Status update failed.';
      alert(msg);
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!activeEnquiry) return;
    setUpdating(true);
    try {
      const updated = await enquiriesService.updateEnquiryStatus(
        activeEnquiry.id,
        activeEnquiry.status,
        adminNotes
      );
      setActiveEnquiry(updated);
      setEnquiries((prev) => prev.map((e) => (e.id === activeEnquiry.id ? updated : e)));
      alert('Internal notes saved successfully.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save notes.';
      alert(msg);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (enq: DbEnquiry) => {
    if (!window.confirm(`Delete enquiry from ${enq.full_name}?`)) return;

    try {
      await enquiriesService.deleteEnquiry(enq.id);
      if (activeEnquiry?.id === enq.id) {
        setActiveEnquiry(null);
      }
      setEnquiries((prev) => prev.filter((e) => e.id !== enq.id));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed.';
      alert(msg);
    }
  };

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

  const statuses: (EnquiryStatus | 'All')[] = ['All', 'New', 'Contacted', 'In Progress', 'Closed'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
          Client Enquiries & Leads
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Review inbound briefs, update statuses, record private studio notes, and initiate direct client conversations.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Status Filter Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`btn ${selectedStatus === st ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: '1 1 240px', maxWidth: '100%' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={16}
              color="var(--text-muted)"
              style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.85rem' }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search client, brand, email..."
              style={{
                padding: '0.5rem 1rem 0.5rem 2.4rem',
                borderRadius: '999px',
                backgroundColor: 'rgba(20, 20, 30, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: '0.84rem',
                outline: 'none',
                width: '100%',
              }}
            />
          </div>
          <button type="submit" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
            Search
          </button>
        </form>
      </div>

      {/* Enquiries Table */}
      <div
        className="card-glass"
        style={{ padding: '1.5rem', backgroundColor: 'rgba(15, 15, 22, 0.8)' }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
            Loading enquiries from database...
          </div>
        ) : enquiries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
            <Inbox size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4 }} />
            <p style={{ fontSize: '1rem', color: '#ffffff', fontWeight: 600 }}>No enquiries matching this criteria.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="admin-desktop-table" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Date</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Client & Brand</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Service Required</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Volume & Deadline</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map((enq) => {
                    const badge = getStatusBadge(enq.status);
                    const dateStr = new Date(enq.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });

                    return (
                      <tr
                        key={enq.id}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                          cursor: 'pointer',
                        }}
                        onClick={() => openDetails(enq)}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                          {dateStr}
                        </td>

                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 700, color: '#ffffff' }}>{enq.full_name}</span>
                            <span style={{ fontSize: '0.78rem', color: 'var(--gold-400)' }}>
                              {enq.brand_name || enq.email}
                            </span>
                          </div>
                        </td>

                        <td style={{ padding: '1rem', color: '#e0e0e8' }}>
                          {enq.editing_type}
                        </td>

                        <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                          {enq.video_count || '1 video'} {enq.deadline ? `• ${enq.deadline}` : ''}
                        </td>

                        <td style={{ padding: '1rem' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '0.2rem 0.65rem',
                              borderRadius: '999px',
                              backgroundColor: badge.bg,
                              color: badge.text,
                              border: `1px solid ${badge.border}`,
                            }}
                          >
                            {enq.status}
                          </span>
                        </td>

                        <td style={{ padding: '1rem', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => openDetails(enq)}
                              className="btn btn-secondary"
                              style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}
                            >
                              Details
                            </button>

                            <button
                              onClick={() => handleDelete(enq)}
                              style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.25)',
                                color: '#fca5a5',
                                padding: '0.45rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                              }}
                              title="Delete enquiry"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="admin-mobile-cards" style={{ display: 'none', flexDirection: 'column', gap: '0.85rem' }}>
              {enquiries.map((enq) => {
                const badge = getStatusBadge(enq.status);
                const dateStr = new Date(enq.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <div
                    key={enq.id}
                    onClick={() => openDetails(enq)}
                    style={{
                      padding: '1rem',
                      borderRadius: '0.85rem',
                      backgroundColor: 'rgba(22, 22, 32, 0.65)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{dateStr}</span>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.55rem',
                          borderRadius: '999px',
                          backgroundColor: badge.bg,
                          color: badge.text,
                          border: `1px solid ${badge.border}`,
                        }}
                      >
                        {enq.status}
                      </span>
                    </div>

                    <div>
                      <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>{enq.full_name}</div>
                      {(enq.brand_name || enq.email) && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--gold-400)' }}>{enq.brand_name || enq.email}</div>
                      )}
                    </div>

                    <div style={{ fontSize: '0.82rem', color: '#d0d0db' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Service: </span>
                      {enq.editing_type}
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {enq.video_count || '1 video'} {enq.deadline ? `• Deadline: ${enq.deadline}` : ''}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '0.6rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => openDetails(enq)}
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem' }}
                      >
                        View Details
                      </button>

                      <button
                        onClick={() => handleDelete(enq)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.25)',
                          color: '#fca5a5',
                          padding: '0.35rem 0.6rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                        title="Delete enquiry"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Enquiry Detail Modal */}
      {activeEnquiry && (
        <div className="modal-backdrop" onClick={() => setActiveEnquiry(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '680px', width: '100%', padding: 'clamp(1.2rem, 3vw, 2.5rem)' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <span className="badge-dark" style={{ fontSize: '0.72rem', marginBottom: '0.4rem' }}>
                  Received {new Date(activeEnquiry.created_at).toLocaleString()}
                </span>
                <h3 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff' }}>
                  {activeEnquiry.full_name}
                </h3>
                {activeEnquiry.brand_name && (
                  <p style={{ color: 'var(--gold-300)', fontSize: '0.9rem', fontWeight: 600 }}>
                    Brand / Channel: {activeEnquiry.brand_name}
                  </p>
                )}
              </div>

              <button
                onClick={() => setActiveEnquiry(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Quick Contact Action Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem',
                borderRadius: '0.85rem',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
              }}
            >
              <a
                href={`https://wa.me/${activeEnquiry.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${activeEnquiry.full_name}, this is RYNX Digital Media following up on your project enquiry for ${activeEnquiry.editing_type}!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
                style={{ padding: '0.55rem 1.15rem', fontSize: '0.84rem', wordBreak: 'break-word', maxWidth: '100%' }}
              >
                <MessageCircle size={16} />
                <span>Chat on WhatsApp ({activeEnquiry.whatsapp_number})</span>
              </a>

              <a
                href={`mailto:${activeEnquiry.email}?subject=RYNX Digital Media - Project Discussion (${activeEnquiry.full_name})`}
                className="btn btn-secondary"
                style={{ padding: '0.55rem 1.15rem', fontSize: '0.84rem' }}
              >
                <Mail size={16} />
                <span>Send Email</span>
              </a>
            </div>

            {/* Project Details Grid */}
            <div className="admin-form-grid-2" style={{ marginBottom: '1.5rem' }}>
              <div style={{ padding: '0.85rem 1rem', borderRadius: '0.75rem', backgroundColor: 'rgba(20, 20, 30, 0.6)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Editing Service</span>
                <p style={{ fontWeight: 600, color: '#ffffff', marginTop: '0.2rem' }}>{activeEnquiry.editing_type}</p>
              </div>

              <div style={{ padding: '0.85rem 1rem', borderRadius: '0.75rem', backgroundColor: 'rgba(20, 20, 30, 0.6)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Volume</span>
                <p style={{ fontWeight: 600, color: '#ffffff', marginTop: '0.2rem' }}>{activeEnquiry.video_count || '1 video'}</p>
              </div>

              <div style={{ padding: '0.85rem 1rem', borderRadius: '0.75rem', backgroundColor: 'rgba(20, 20, 30, 0.6)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Deadline</span>
                <p style={{ fontWeight: 600, color: '#ffffff', marginTop: '0.2rem' }}>{activeEnquiry.deadline || 'Flexible'}</p>
              </div>

              <div style={{ padding: '0.85rem 1rem', borderRadius: '0.75rem', backgroundColor: 'rgba(20, 20, 30, 0.6)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Approx Budget</span>
                <p style={{ fontWeight: 600, color: 'var(--gold-300)', marginTop: '0.2rem' }}>{activeEnquiry.budget || 'To Discuss'}</p>
              </div>
            </div>

            {/* Reference Link */}
            {activeEnquiry.reference_link && (
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>
                  Client Reference Video / Drive
                </span>
                <a
                  href={activeEnquiry.reference_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: 'var(--gold-400)',
                    fontSize: '0.88rem',
                    textDecoration: 'underline',
                    wordBreak: 'break-all',
                  }}
                >
                  <span>{activeEnquiry.reference_link}</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            )}

            {/* Description Brief */}
            <div style={{ marginBottom: '1.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                Project Description & Vision
              </span>
              <div
                style={{
                  padding: '1.15rem',
                  borderRadius: '0.85rem',
                  backgroundColor: 'rgba(22, 22, 32, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#e4e4ed',
                  fontSize: '0.92rem',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {activeEnquiry.description}
              </div>
            </div>

            {/* Status Change & Admin Internal Notes */}
            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>Update Status:</span>
                  <select
                    value={activeEnquiry.status}
                    onChange={(e) => handleStatusChange(activeEnquiry.id, e.target.value as EnquiryStatus)}
                    disabled={updating}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '0.5rem',
                      backgroundColor: '#161622',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      color: 'var(--gold-300)',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      outline: 'none',
                    }}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <button
                  onClick={handleSaveNotes}
                  disabled={updating}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}
                >
                  Save Internal Notes
                </button>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Studio Internal Notes (Not visible to client):
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Discussed pricing on WhatsApp, scheduled test cut for Thursday..."
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '0.65rem',
                    backgroundColor: 'rgba(22, 22, 32, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

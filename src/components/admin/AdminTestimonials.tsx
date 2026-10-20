import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Star,
  MessageSquareQuote,
  AlertCircle,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
} from 'lucide-react';
import type { DbTestimonial } from '../../types/database';
import { testimonialsService } from '../../services/testimonialsService';

export const AdminTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<DbTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DbTestimonial | null>(null);

  // Form State
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [clientDesignation, setClientDesignation] = useState('');
  const [testimonialText, setTestimonialText] = useState('');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [rating, setRating] = useState('5');
  const [isPublished, setIsPublished] = useState(true);
  const [displayOrder, setDisplayOrder] = useState('0');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    try {
      const data = await testimonialsService.getAllTestimonialsAdmin();
      setTestimonials(data);
    } catch (err: unknown) {
      console.warn('Error loading admin testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setClientName('');
    setCompanyName('');
    setClientDesignation('');
    setTestimonialText('');
    setProfilePhotoUrl('');
    setVideoUrl('');
    setRating('5');
    setIsPublished(true);
    setDisplayOrder('0');
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: DbTestimonial) => {
    setEditingItem(item);
    setClientName(item.client_name);
    setCompanyName(item.company_name || '');
    setClientDesignation(item.client_designation || '');
    setTestimonialText(item.testimonial_text);
    setProfilePhotoUrl(item.profile_photo_url || '');
    setVideoUrl(item.video_url || '');
    setRating(String(item.rating || 5));
    setIsPublished(item.is_published);
    setDisplayOrder(String(item.display_order));
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsModalOpen(true);
  };

  const handleTogglePublish = async (item: DbTestimonial) => {
    try {
      await testimonialsService.updateTestimonial(item.id, {
        is_published: !item.is_published,
      });
      await loadAll();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Publish toggle failed.';
      alert(msg);
    }
  };

  const handleDelete = async (item: DbTestimonial) => {
    if (!window.confirm(`Are you sure you want to delete testimonial from "${item.client_name}"?`)) {
      return;
    }

    try {
      await testimonialsService.deleteTestimonial(item.id);
      await loadAll();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed.';
      alert(msg);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!clientName.trim()) {
      setErrorMsg('Client name is required.');
      return;
    }
    if (!testimonialText.trim()) {
      setErrorMsg('Testimonial text is required.');
      return;
    }

    setSubmitting(true);

    try {
      if (editingItem) {
        await testimonialsService.updateTestimonial(editingItem.id, {
          client_name: clientName.trim(),
          company_name: companyName.trim() || null,
          client_designation: clientDesignation.trim() || null,
          testimonial_text: testimonialText.trim(),
          profile_photo_url: profilePhotoUrl.trim() || null,
          video_url: videoUrl.trim() || null,
          rating: Number(rating) || 5,
          is_published: isPublished,
          display_order: Number(displayOrder) || 0,
        });
        setSuccessMsg('Testimonial updated successfully.');
      } else {
        await testimonialsService.createTestimonial({
          client_name: clientName.trim(),
          company_name: companyName.trim() || null,
          client_designation: clientDesignation.trim() || null,
          testimonial_text: testimonialText.trim(),
          profile_photo_url: profilePhotoUrl.trim() || null,
          video_url: videoUrl.trim() || null,
          rating: Number(rating) || 5,
          is_published: isPublished,
          display_order: Number(displayOrder) || 0,
        });
        setSuccessMsg('Testimonial created successfully.');
      }

      await loadAll();
      setTimeout(() => {
        setIsModalOpen(false);
      }, 700);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Operation failed.';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
            Client Testimonials
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Manage published endorsements and client reviews. Only published reviews display on the homepage.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="btn btn-primary"
          style={{ fontSize: '0.84rem', padding: '0.65rem 1.35rem' }}
        >
          <Plus size={16} />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* List / Table */}
      <div
        className="card-glass"
        style={{ padding: '1.5rem', backgroundColor: 'rgba(15, 15, 22, 0.8)' }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
            Loading testimonials...
          </div>
        ) : testimonials.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
            <MessageSquareQuote size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4 }} />
            <p style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#ffffff', fontWeight: 600 }}>
              No testimonials recorded yet.
            </p>
            <p style={{ fontSize: '0.85rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
              Add authentic creator and client testimonials to display on the public website.
            </p>
            <button onClick={openAddModal} className="btn btn-primary" style={{ fontSize: '0.84rem' }}>
              Add First Testimonial
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '1.25rem' }}>
            {testimonials.map((t) => (
              <div
                key={t.id}
                style={{
                  padding: '1.5rem',
                  borderRadius: '1rem',
                  backgroundColor: 'rgba(22, 22, 32, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.2rem' }}>
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} size={14} fill="var(--gold-400)" color="var(--gold-400)" />
                    ))}
                  </div>

                  <button
                    onClick={() => handleTogglePublish(t)}
                    style={{
                      background: t.is_published
                        ? 'rgba(34, 197, 94, 0.12)'
                        : 'rgba(239, 68, 68, 0.12)',
                      border: `1px solid ${t.is_published ? '#22c55e' : '#ef4444'}`,
                      color: t.is_published ? '#86efac' : '#fca5a5',
                      borderRadius: '999px',
                      padding: '0.15rem 0.55rem',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    {t.is_published ? <Eye size={11} /> : <EyeOff size={11} />}
                    <span>{t.is_published ? 'Published' : 'Draft'}</span>
                  </button>
                </div>

                <p style={{ fontSize: '0.9rem', color: '#e2e2ea', fontStyle: 'italic', marginBottom: '1.25rem', lineHeight: 1.5, flexGrow: 1 }}>
                  "{t.testimonial_text}"
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    {t.profile_photo_url && (
                      <img
                        src={t.profile_photo_url}
                        alt={t.client_name}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    )}
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>{t.client_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {t.client_designation || t.company_name || 'Verified Client'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => openEditModal(t)}
                      style={{ background: 'rgba(255, 255, 255, 0.05)', border: 'none', color: '#ffffff', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(t)}
                      style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#fca5a5', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '600px', width: '100%', padding: 'clamp(1.2rem, 3vw, 2rem)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff' }}>
                {editingItem ? 'Edit Testimonial' : 'Add Testimonial'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {errorMsg && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#fca5a5',
                  fontSize: '0.85rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  backgroundColor: 'rgba(34, 197, 94, 0.12)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  color: '#86efac',
                  fontSize: '0.85rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <CheckCircle2 size={16} />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="admin-form-grid-2" style={{ marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                    Client Name *
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Marcus Thorne"
                    required
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: '0.75rem',
                      backgroundColor: 'rgba(22, 22, 32, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '0.92rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                    Role / Designation
                  </label>
                  <input
                    type="text"
                    value={clientDesignation}
                    onChange={(e) => setClientDesignation(e.target.value)}
                    placeholder="e.g. YouTube Creator (500K subs)"
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: '0.75rem',
                      backgroundColor: 'rgba(22, 22, 32, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '0.92rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div className="admin-form-grid-2" style={{ marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                    Company / Brand Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Thorne Media"
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: '0.75rem',
                      backgroundColor: 'rgba(22, 22, 32, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '0.92rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                    Star Rating (1 to 5)
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: '0.75rem',
                      backgroundColor: '#161622',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '0.92rem',
                      outline: 'none',
                    }}
                  >
                    <option value="5">★★★★★ (5 Stars)</option>
                    <option value="4">★★★★☆ (4 Stars)</option>
                    <option value="3">★★★☆☆ (3 Stars)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                  Client Profile Photo URL (Optional)
                </label>
                <input
                  type="url"
                  value={profilePhotoUrl}
                  onChange={(e) => setProfilePhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or hosted image"
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    borderRadius: '0.75rem',
                    backgroundColor: 'rgba(22, 22, 32, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontSize: '0.92rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                  Testimonial Quote Text *
                </label>
                <textarea
                  value={testimonialText}
                  onChange={(e) => setTestimonialText(e.target.value)}
                  rows={4}
                  required
                  placeholder="Client feedback on pacing, retention, communication, or color grading..."
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    borderRadius: '0.75rem',
                    backgroundColor: 'rgba(22, 22, 32, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontSize: '0.92rem',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', color: '#ffffff', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    style={{ accentColor: 'var(--gold-400)', width: '18px', height: '18px' }}
                  />
                  <span>Publish Immediately (Live on Website)</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.86rem', padding: '0.65rem 1.25rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ fontSize: '0.86rem', padding: '0.65rem 1.35rem' }}
                >
                  {submitting ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  SlidersHorizontal,
  AlertCircle,
  CheckCircle2,
  X,
} from 'lucide-react';
import type { DbBeforeAfterProject } from '../../types/database';
import { beforeAfterService } from '../../services/beforeAfterService';

export const AdminBeforeAfter: React.FC = () => {
  const [items, setItems] = useState<DbBeforeAfterProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DbBeforeAfterProject | null>(null);

  // Form State
  const [projectName, setProjectName] = useState('');
  const [rawFootageUrl, setRawFootageUrl] = useState('');
  const [finalVideoUrl, setFinalVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [displayOrder, setDisplayOrder] = useState('0');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    try {
      const data = await beforeAfterService.getAllBeforeAfterAdmin();
      setItems(data);
    } catch (err: unknown) {
      console.warn('Error loading admin before-after:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setProjectName('');
    setRawFootageUrl('');
    setFinalVideoUrl('');
    setThumbnailUrl('');
    setIsPublished(true);
    setDisplayOrder('0');
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: DbBeforeAfterProject) => {
    setEditingItem(item);
    setProjectName(item.project_name);
    setRawFootageUrl(item.raw_footage_url);
    setFinalVideoUrl(item.final_video_url);
    setThumbnailUrl(item.thumbnail_url || '');
    setIsPublished(item.is_published);
    setDisplayOrder(String(item.display_order));
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsModalOpen(true);
  };

  const handleTogglePublish = async (item: DbBeforeAfterProject) => {
    try {
      await beforeAfterService.updateBeforeAfter(item.id, {
        is_published: !item.is_published,
      });
      await loadAll();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Publish toggle failed.';
      alert(msg);
    }
  };

  const handleDelete = async (item: DbBeforeAfterProject) => {
    if (!window.confirm(`Delete comparison "${item.project_name}"?`)) return;

    try {
      await beforeAfterService.deleteBeforeAfter(item.id);
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

    if (!projectName.trim()) {
      setErrorMsg('Project name is required.');
      return;
    }
    if (!rawFootageUrl.trim()) {
      setErrorMsg('Raw footage image/video URL is required.');
      return;
    }
    if (!finalVideoUrl.trim()) {
      setErrorMsg('Final edited image/video URL is required.');
      return;
    }

    setSubmitting(true);

    try {
      if (editingItem) {
        await beforeAfterService.updateBeforeAfter(editingItem.id, {
          project_name: projectName.trim(),
          raw_footage_url: rawFootageUrl.trim(),
          final_video_url: finalVideoUrl.trim(),
          thumbnail_url: thumbnailUrl.trim() || null,
          is_published: isPublished,
          display_order: Number(displayOrder) || 0,
        });
        setSuccessMsg('Comparison project updated.');
      } else {
        await beforeAfterService.createBeforeAfter({
          project_name: projectName.trim(),
          raw_footage_url: rawFootageUrl.trim(),
          final_video_url: finalVideoUrl.trim(),
          thumbnail_url: thumbnailUrl.trim() || null,
          is_published: isPublished,
          display_order: Number(displayOrder) || 0,
        });
        setSuccessMsg('Comparison project created.');
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
            Before & After Comparisons
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Manage interactive split-screen comparisons (LOG/Flat raw footage vs. final color-graded master).
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="btn btn-primary"
          style={{ fontSize: '0.84rem', padding: '0.65rem 1.35rem' }}
        >
          <Plus size={16} />
          <span>Add Comparison</span>
        </button>
      </div>

      {/* List */}
      <div
        className="card-glass"
        style={{ padding: '1.5rem', backgroundColor: 'rgba(15, 15, 22, 0.8)' }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
            Loading comparisons...
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
            <SlidersHorizontal size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4 }} />
            <p style={{ fontSize: '1rem', color: '#ffffff', fontWeight: 600, marginBottom: '0.5rem' }}>
              No comparison projects published yet.
            </p>
            <p style={{ fontSize: '0.85rem', maxWidth: '440px', margin: '0 auto 1.5rem auto' }}>
              The public Before & After slider is automatically hidden when empty. Add your first real color grading transformation below to display it.
            </p>
            <button onClick={openAddModal} className="btn btn-primary" style={{ fontSize: '0.84rem' }}>
              Add First Comparison
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '1.25rem',
                  borderRadius: '1rem',
                  backgroundColor: 'rgba(22, 22, 32, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem', borderRadius: '0.5rem', overflow: 'hidden' }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                      RAW Log
                    </span>
                    <img
                      src={item.raw_footage_url}
                      alt="Raw"
                      style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--gold-400)', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                      Final Grade
                    </span>
                    <img
                      src={item.final_video_url}
                      alt="Final"
                      style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>{item.project_name}</h4>
                  <button
                    onClick={() => handleTogglePublish(item)}
                    style={{
                      background: item.is_published
                        ? 'rgba(34, 197, 94, 0.12)'
                        : 'rgba(239, 68, 68, 0.12)',
                      border: `1px solid ${item.is_published ? '#22c55e' : '#ef4444'}`,
                      color: item.is_published ? '#86efac' : '#fca5a5',
                      borderRadius: '999px',
                      padding: '0.15rem 0.55rem',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {item.is_published ? 'Published' : 'Draft'}
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <button
                    onClick={() => openEditModal(item)}
                    style={{ background: 'rgba(255, 255, 255, 0.05)', border: 'none', color: '#ffffff', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#fca5a5', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '600px', padding: '2rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff' }}>
                {editingItem ? 'Edit Comparison' : 'Add Comparison'}
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
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                  Project Name *
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Apex Hypercar Color Grade"
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

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                  Raw Footage URL (Flat / LOG image or video) *
                </label>
                <input
                  type="url"
                  value={rawFootageUrl}
                  onChange={(e) => setRawFootageUrl(e.target.value)}
                  placeholder="https://..."
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

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                  Final Video / Color Graded URL *
                </label>
                <input
                  type="url"
                  value={finalVideoUrl}
                  onChange={(e) => setFinalVideoUrl(e.target.value)}
                  placeholder="https://..."
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

              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', color: '#ffffff', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    style={{ accentColor: 'var(--gold-400)', width: '18px', height: '18px' }}
                  />
                  <span>Publish (Display in website comparison section)</span>
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
                  {submitting ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Comparison'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

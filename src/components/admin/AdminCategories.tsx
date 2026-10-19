import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Tags, AlertCircle, CheckCircle2, X } from 'lucide-react';
import type { Category } from '../../types/database';
import { categoriesService } from '../../services/categoriesService';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await categoriesService.getCategories();
      setCategories(data);
    } catch (err: unknown) {
      console.warn('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setDisplayOrder('0');
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setDisplayOrder(String(cat.display_order));
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      // Auto-slugify
      setSlug(
        val
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '')
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanName = name.trim();
    const cleanSlug = slug.trim().toLowerCase();

    if (!cleanName) {
      setErrorMsg('Category name is required.');
      return;
    }
    if (!cleanSlug) {
      setErrorMsg('Slug is required.');
      return;
    }
    if (cleanName.toLowerCase() === 'all' || cleanSlug === 'all') {
      setErrorMsg('"All" is a reserved virtual filter and cannot be saved to the database.');
      return;
    }

    setSubmitting(true);

    try {
      if (editingCategory) {
        await categoriesService.updateCategory(editingCategory.id, {
          name: cleanName,
          slug: cleanSlug,
          description: description.trim() || null,
          display_order: Number(displayOrder) || 0,
        });
        setSuccessMsg('Category updated successfully.');
      } else {
        await categoriesService.createCategory({
          name: cleanName,
          slug: cleanSlug,
          description: description.trim() || null,
          display_order: Number(displayOrder) || 0,
        });
        setSuccessMsg('Category created successfully.');
      }

      await loadCategories();
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

  const handleDelete = async (cat: Category) => {
    if (!window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      return;
    }

    try {
      await categoriesService.deleteCategory(cat.id);
      await loadCategories();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed.';
      alert(msg);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
            Categories Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Manage public portfolio filters. Note: "All" is a system virtual filter and is never stored in the database.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="btn btn-primary"
          style={{ fontSize: '0.84rem', padding: '0.65rem 1.35rem' }}
        >
          <Plus size={16} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Table / Card Grid */}
      <div
        className="card-glass"
        style={{ padding: '1.5rem', backgroundColor: 'rgba(15, 15, 22, 0.8)' }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <Tags size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4 }} />
            <p style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>No categories created yet.</p>
            <button onClick={openAddModal} className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>
              Create First Category
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Order</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Name</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Slug</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Description</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr
                    key={cat.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '1rem', color: 'var(--gold-400)', fontWeight: 700 }}>
                      #{cat.display_order}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#ffffff' }}>
                      {cat.name}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '0.82rem' }}>
                      {cat.slug}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {cat.description || '—'}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => openEditModal(cat)}
                          aria-label="Edit category"
                          style={{
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#ffffff',
                            padding: '0.45rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                          }}
                        >
                          <Edit2 size={14} />
                        </button>

                        <button
                          onClick={() => handleDelete(cat)}
                          aria-label="Delete category"
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            color: '#fca5a5',
                            padding: '0.45rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '520px', padding: '2rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff' }}>
                {editingCategory ? 'Edit Category' : 'Create Category'}
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
                  Category Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. YouTube Videos or Cinematic Editing"
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
                  Slug (URL Safe) *
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. youtube-videos"
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
                    fontFamily: 'monospace',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Short description of this editing niche..."
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

              <div style={{ marginBottom: '1.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                  Display Order
                </label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
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
                  {submitting ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

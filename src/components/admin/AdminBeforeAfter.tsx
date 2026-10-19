import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  X,
  Upload,
  RefreshCw,
  ImageIcon,
  Eye,
  EyeOff,
} from 'lucide-react';
import type { DbBeforeAfterProject } from '../../types/database';
import { beforeAfterService } from '../../services/beforeAfterService';
import { storageService, STORAGE_BUCKET_BEFORE_AFTER } from '../../services/storageService';

export const AdminBeforeAfter: React.FC = () => {
  const [items, setItems] = useState<DbBeforeAfterProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DbBeforeAfterProject | null>(null);

  // Form State
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [displayOrder, setDisplayOrder] = useState('0');

  // Image Upload State
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [beforePreviewUrl, setBeforePreviewUrl] = useState<string | null>(null);
  const [afterPreviewUrl, setAfterPreviewUrl] = useState<string | null>(null);
  const [existingBeforeUrl, setExistingBeforeUrl] = useState<string | null>(null);
  const [existingAfterUrl, setExistingAfterUrl] = useState<string | null>(null);

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

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

  // Cleanup object URLs on unmount or file change
  useEffect(() => {
    return () => {
      if (beforePreviewUrl && beforePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(beforePreviewUrl);
      }
      if (afterPreviewUrl && afterPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(afterPreviewUrl);
      }
    };
  }, [beforePreviewUrl, afterPreviewUrl]);

  const openAddModal = () => {
    setEditingItem(null);
    setProjectName('');
    setDescription('');
    setIsFeatured(items.length === 0); // Default to featured if first item
    setIsPublished(true);
    setDisplayOrder('0');

    setBeforeFile(null);
    setAfterFile(null);
    setBeforePreviewUrl(null);
    setAfterPreviewUrl(null);
    setExistingBeforeUrl(null);
    setExistingAfterUrl(null);
    setUploadProgress(0);
    setIsUploading(false);

    setErrorMsg(null);
    setSuccessMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: DbBeforeAfterProject) => {
    setEditingItem(item);
    setProjectName(item.project_name);
    setDescription(item.description || '');
    setIsFeatured(Boolean(item.is_featured));
    setIsPublished(item.is_published);
    setDisplayOrder(String(item.display_order));

    setBeforeFile(null);
    setAfterFile(null);
    setBeforePreviewUrl(null);
    setAfterPreviewUrl(null);
    setExistingBeforeUrl(item.raw_footage_url);
    setExistingAfterUrl(item.final_video_url);
    setUploadProgress(0);
    setIsUploading(false);

    setErrorMsg(null);
    setSuccessMsg(null);
    setIsModalOpen(true);
  };

  const handleSelectBefore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPEG, PNG, WebP) for Before / RAW footage.');
      return;
    }

    if (beforePreviewUrl && beforePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(beforePreviewUrl);
    }
    setBeforeFile(file);
    setBeforePreviewUrl(URL.createObjectURL(file));
  };

  const handleSelectAfter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPEG, PNG, WebP) for After / Final Grade.');
      return;
    }

    if (afterPreviewUrl && afterPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(afterPreviewUrl);
    }
    setAfterFile(file);
    setAfterPreviewUrl(URL.createObjectURL(file));
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

  const handleSetFeatured = async (item: DbBeforeAfterProject) => {
    try {
      await beforeAfterService.updateBeforeAfter(item.id, {
        is_featured: true,
      });
      await loadAll();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to set featured.';
      alert(msg);
    }
  };

  const handleDelete = async (item: DbBeforeAfterProject) => {
    if (!window.confirm(`Delete comparison "${item.project_name}"? This will also remove the uploaded comparison images.`)) {
      return;
    }

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
      setErrorMsg('Comparison title is required.');
      return;
    }

    if (!editingItem && (!beforeFile || !afterFile)) {
      setErrorMsg('Both Before and After images are required.');
      return;
    }

    setSubmitting(true);

    let newlyUploadedBeforePath: string | null = null;
    let newlyUploadedAfterPath: string | null = null;

    try {
      let finalBeforeUrl = existingBeforeUrl || '';
      let finalAfterUrl = existingAfterUrl || '';
      let finalBeforePath = editingItem?.before_image_path || null;
      let finalAfterPath = editingItem?.after_image_path || null;

      if (beforeFile || afterFile) {
        setIsUploading(true);
        setUploadProgress(0);

        // Upload Before Image if selected
        if (beforeFile) {
          const res = await storageService.uploadBeforeAfterImage(beforeFile, 'before', (pct) => {
            setUploadProgress(Math.round(pct * 0.5));
          });
          newlyUploadedBeforePath = res.imagePath;
          finalBeforeUrl = res.imageUrl;
          finalBeforePath = res.imagePath;
        }

        // Upload After Image if selected
        if (afterFile) {
          const res = await storageService.uploadBeforeAfterImage(afterFile, 'after', (pct) => {
            setUploadProgress(50 + Math.round(pct * 0.5));
          });
          newlyUploadedAfterPath = res.imagePath;
          finalAfterUrl = res.imageUrl;
          finalAfterPath = res.imagePath;
        }
      }

      if (editingItem) {
        const prevBeforePath = editingItem.before_image_path;
        const prevAfterPath = editingItem.after_image_path;

        await beforeAfterService.updateBeforeAfter(editingItem.id, {
          project_name: projectName.trim(),
          description: description.trim() || null,
          raw_footage_url: finalBeforeUrl,
          final_video_url: finalAfterUrl,
          before_image_path: finalBeforePath,
          after_image_path: finalAfterPath,
          is_featured: isFeatured,
          is_published: isPublished,
          display_order: Number(displayOrder) || 0,
        });

        // Clean up previous storage files if replaced
        if (beforeFile && prevBeforePath && prevBeforePath !== finalBeforePath) {
          await storageService.deleteFile(STORAGE_BUCKET_BEFORE_AFTER, prevBeforePath);
        }
        if (afterFile && prevAfterPath && prevAfterPath !== finalAfterPath) {
          await storageService.deleteFile(STORAGE_BUCKET_BEFORE_AFTER, prevAfterPath);
        }

        setSuccessMsg('Comparison updated successfully.');
      } else {
        await beforeAfterService.createBeforeAfter({
          project_name: projectName.trim(),
          description: description.trim() || null,
          raw_footage_url: finalBeforeUrl,
          final_video_url: finalAfterUrl,
          thumbnail_url: finalAfterUrl,
          before_image_path: finalBeforePath,
          after_image_path: finalAfterPath,
          is_featured: isFeatured,
          is_published: isPublished,
          display_order: Number(displayOrder) || 0,
        });

        setSuccessMsg('Comparison published successfully.');
      }

      await loadAll();
      setTimeout(() => {
        setIsModalOpen(false);
      }, 700);
    } catch (err: unknown) {
      // Clean up orphaned storage files on failure
      if (newlyUploadedBeforePath) {
        await storageService.deleteFile(STORAGE_BUCKET_BEFORE_AFTER, newlyUploadedBeforePath);
      }
      if (newlyUploadedAfterPath) {
        await storageService.deleteFile(STORAGE_BUCKET_BEFORE_AFTER, newlyUploadedAfterPath);
      }

      const msg = err instanceof Error ? err.message : 'Failed to save comparison.';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
            Before & After Comparisons
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Upload RAW / flat LOG camera frames and Final graded images to showcase your color grading transformation.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', padding: '0.65rem 1.25rem' }}
        >
          <Plus size={18} /> Add Comparison
        </button>
      </div>

      {/* Comparisons Table */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
          <div style={{ color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '22px', height: '22px', border: '2px solid rgba(212,175,55,0.2)', borderTopColor: '#d4af37', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span>Loading before & after comparisons...</span>
          </div>
        </div>
      ) : items.length === 0 ? (
        <div
          className="card-glass"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            borderRadius: '1rem',
            border: '1px dashed rgba(212, 175, 55, 0.25)',
          }}
        >
          <ImageIcon size={44} style={{ color: 'var(--gold-400)', margin: '0 auto 1.25rem', opacity: 0.7 }} />
          <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '0.5rem' }}>No Real Comparisons Uploaded Yet</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '460px', margin: '0 auto 1.5rem', fontSize: '0.88rem' }}>
            The public website is currently displaying the built-in cinematic sample comparison. Upload your first real client RAW vs Graded images to replace it automatically!
          </p>
          <button onClick={openAddModal} className="btn btn-primary" style={{ fontSize: '0.86rem' }}>
            <Plus size={16} /> Upload First Comparison
          </button>
        </div>
      ) : (
        <div className="card-glass" style={{ borderRadius: '1rem', overflow: 'hidden', border: '1px solid var(--border-gold-subtle)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                  <th style={{ padding: '1rem 1.25rem', color: 'var(--gold-400)', fontWeight: 600 }}>Project / Title</th>
                  <th style={{ padding: '1rem 1.25rem', color: 'var(--gold-400)', fontWeight: 600 }}>RAW Frame</th>
                  <th style={{ padding: '1rem 1.25rem', color: 'var(--gold-400)', fontWeight: 600 }}>Final Grade</th>
                  <th style={{ padding: '1rem 1.25rem', color: 'var(--gold-400)', fontWeight: 600 }}>Featured</th>
                  <th style={{ padding: '1rem 1.25rem', color: 'var(--gold-400)', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '1rem 1.25rem', color: 'var(--gold-400)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr
                    key={it.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.03)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 600, color: '#ffffff' }}>{it.project_name}</div>
                      {it.description && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          {it.description}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div
                        style={{
                          width: '70px',
                          height: '42px',
                          borderRadius: '0.35rem',
                          overflow: 'hidden',
                          backgroundColor: '#000',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <img src={it.raw_footage_url} alt="RAW frame" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div
                        style={{
                          width: '70px',
                          height: '42px',
                          borderRadius: '0.35rem',
                          overflow: 'hidden',
                          backgroundColor: '#000',
                          border: '1px solid rgba(212, 175, 55, 0.3)',
                        }}
                      >
                        <img src={it.final_video_url} alt="Final grade" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      {it.is_featured ? (
                        <span
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '0.25rem',
                            backgroundColor: 'rgba(212, 175, 55, 0.15)',
                            color: 'var(--gold-400)',
                            border: '1px solid rgba(212, 175, 55, 0.3)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <Sparkles size={11} /> Default
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSetFeatured(it)}
                          style={{
                            background: 'none',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'var(--text-muted)',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}
                        >
                          Set Default
                        </button>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <button
                        onClick={() => handleTogglePublish(it)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.3rem 0.65rem',
                          borderRadius: '1rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          border: 'none',
                          backgroundColor: it.is_published ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: it.is_published ? '#4ade80' : '#f87171',
                        }}
                      >
                        {it.is_published ? <Eye size={12} /> : <EyeOff size={12} />}
                        {it.is_published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => openEditModal(it)}
                          style={{
                            padding: '0.45rem',
                            borderRadius: '0.4rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#ffffff',
                            cursor: 'pointer',
                          }}
                          title="Edit Comparison"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(it)}
                          style={{
                            padding: '0.45rem',
                            borderRadius: '0.4rem',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            color: '#f87171',
                            cursor: 'pointer',
                          }}
                          title="Delete Comparison"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Comparison Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            overflowY: 'auto',
          }}
        >
          <div
            className="card-glass"
            style={{
              width: '100%',
              maxWidth: '700px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '1.25rem',
              border: '1px solid var(--border-gold-subtle)',
              padding: '2rem',
              backgroundColor: '#0e0e15',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
                  {editingItem ? 'Edit Comparison' : 'Upload Before & After Images'}
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Upload high-resolution camera LOG and Graded master frames directly to Supabase Storage.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.25rem',
                }}
              >
                <X size={22} />
              </button>
            </div>

            {errorMsg && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#fca5a5',
                  fontSize: '0.85rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <AlertCircle size={16} /> {errorMsg}
              </div>
            )}
            {successMsg && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  backgroundColor: 'rgba(34, 197, 94, 0.12)',
                  border: '1px solid rgba(34, 197, 94, 0.25)',
                  color: '#86efac',
                  fontSize: '0.85rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <CheckCircle2 size={16} /> {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* IMAGE UPLOAD SLOTS: BEFORE & AFTER */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                {/* BEFORE IMAGE */}
                <div
                  style={{
                    padding: '1.25rem',
                    borderRadius: '0.85rem',
                    backgroundColor: 'rgba(20, 20, 30, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>
                    1. Before Image (RAW/LOG) *
                  </label>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    Ungraded camera frame
                  </p>

                  <input
                    type="file"
                    ref={beforeInputRef}
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={handleSelectBefore}
                    style={{ display: 'none' }}
                  />

                  <div
                    onClick={() => beforeInputRef.current?.click()}
                    style={{
                      border: '2px dashed rgba(255, 255, 255, 0.2)',
                      borderRadius: '0.65rem',
                      padding: '1.25rem 0.5rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    {beforePreviewUrl || existingBeforeUrl ? (
                      <div>
                        <img
                          src={beforePreviewUrl || existingBeforeUrl || undefined}
                          alt="Before Preview"
                          style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '0.4rem', marginBottom: '0.5rem' }}
                        />
                        <div style={{ fontSize: '0.75rem', color: 'var(--gold-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                          <RefreshCw size={12} /> Replace Before Image
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Upload size={24} style={{ color: 'var(--text-muted)', margin: '0 auto 0.5rem' }} />
                        <div style={{ color: '#ffffff', fontSize: '0.82rem', fontWeight: 600 }}>Choose Before Image</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>PNG, JPEG, WebP</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* AFTER IMAGE */}
                <div
                  style={{
                    padding: '1.25rem',
                    borderRadius: '0.85rem',
                    backgroundColor: 'rgba(20, 20, 30, 0.6)',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                  }}
                >
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--gold-400)', marginBottom: '0.35rem' }}>
                    2. After Image (Final Grade) *
                  </label>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    Color graded master frame
                  </p>

                  <input
                    type="file"
                    ref={afterInputRef}
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={handleSelectAfter}
                    style={{ display: 'none' }}
                  />

                  <div
                    onClick={() => afterInputRef.current?.click()}
                    style={{
                      border: '2px dashed rgba(212, 175, 55, 0.4)',
                      borderRadius: '0.65rem',
                      padding: '1.25rem 0.5rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    {afterPreviewUrl || existingAfterUrl ? (
                      <div>
                        <img
                          src={afterPreviewUrl || existingAfterUrl || undefined}
                          alt="After Preview"
                          style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '0.4rem', marginBottom: '0.5rem' }}
                        />
                        <div style={{ fontSize: '0.75rem', color: 'var(--gold-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                          <RefreshCw size={12} /> Replace After Image
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Upload size={24} style={{ color: 'var(--gold-400)', margin: '0 auto 0.5rem' }} />
                        <div style={{ color: '#ffffff', fontSize: '0.82rem', fontWeight: 600 }}>Choose After Image</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>PNG, JPEG, WebP</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload Progress Bar */}
              {isUploading && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--gold-400)', marginBottom: '0.35rem' }}>
                    <span>Uploading comparison images to Supabase Storage...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', borderRadius: '3px', backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${uploadProgress}%`,
                        height: '100%',
                        backgroundColor: 'var(--gold-400)',
                        transition: 'width 0.2s ease',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Title */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                  Comparison Project Name / Title *
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. BMW M4 Commercial — Arri LOG to Golden Hour Master"
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

              {/* Description */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Highlight key color sculpting, LUT styling, or dynamic range recovery..."
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

              {/* Display Order & Toggles */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.25rem', marginBottom: '1.75rem', alignItems: 'center' }}>
                <div>
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1.25rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', color: '#ffffff', fontSize: '0.88rem' }}>
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      style={{ accentColor: 'var(--gold-400)', width: '18px', height: '18px' }}
                    />
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Sparkles size={14} style={{ color: 'var(--gold-400)' }} /> Set as Default Featured Comparison
                    </span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', color: '#ffffff', fontSize: '0.88rem' }}>
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      style={{ accentColor: 'var(--gold-400)', width: '18px', height: '18px' }}
                    />
                    <span>Publish Immediately (Visible to Public)</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
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
                  {submitting ? 'Uploading & Saving...' : editingItem ? 'Save Changes' : 'Upload & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Film,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
} from 'lucide-react';
import type { DbPortfolioProject, Category } from '../../types/database';
import { portfolioService } from '../../services/portfolioService';
import { categoriesService } from '../../services/categoriesService';

export const AdminPortfolio: React.FC = () => {
  const [projects, setProjects] = useState<DbPortfolioProject[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<DbPortfolioProject | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [previewVideoUrl, setPreviewVideoUrl] = useState('');
  const [fullVideoUrl, setFullVideoUrl] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '2.39:1'>('16:9');
  const [duration, setDuration] = useState('00:30');
  const [clientIndustry, setClientIndustry] = useState('');
  const [deliverablesStr, setDeliverablesStr] = useState('');
  const [toolsStr, setToolsStr] = useState('');
  const [caseStudy, setCaseStudy] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [displayOrder, setDisplayOrder] = useState('0');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [projs, cats] = await Promise.all([
        portfolioService.getAllProjectsAdmin(),
        categoriesService.getCategories(),
      ]);
      setProjects(projs);
      setCategories(cats);
    } catch (err: unknown) {
      console.warn('Error loading admin portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const openAddModal = () => {
    setEditingProject(null);
    setTitle('');
    setSlug('');
    setDescription('');
    setCategoryId(categories[0]?.id || '');
    setThumbnailUrl('');
    setPreviewVideoUrl('');
    setFullVideoUrl('');
    setAspectRatio('16:9');
    setDuration('00:30');
    setClientIndustry('');
    setDeliverablesStr('4K UHD Master, Social Cutdowns');
    setToolsStr('Premiere Pro, DaVinci Resolve, After Effects');
    setCaseStudy('');
    setIsFeatured(false);
    setIsPublished(true);
    setDisplayOrder('0');
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (proj: DbPortfolioProject) => {
    setEditingProject(proj);
    setTitle(proj.title);
    setSlug(proj.slug);
    setDescription(proj.description);
    setCategoryId(proj.category_id || '');
    setThumbnailUrl(proj.thumbnail_url);
    setPreviewVideoUrl(proj.preview_video_url || '');
    setFullVideoUrl(proj.full_video_url || '');
    setAspectRatio(proj.aspect_ratio || '16:9');
    setDuration(proj.duration || '00:30');
    setClientIndustry(proj.client_industry || '');
    setDeliverablesStr((proj.deliverables || []).join(', '));
    setToolsStr((proj.tools_used || []).join(', '));
    setCaseStudy(proj.case_study || '');
    setIsFeatured(proj.is_featured);
    setIsPublished(proj.is_published);
    setDisplayOrder(String(proj.display_order));
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingProject) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '')
      );
    }
  };

  const handleTogglePublish = async (proj: DbPortfolioProject) => {
    try {
      await portfolioService.updateProject(proj.id, {
        is_published: !proj.is_published,
      });
      await loadAll();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Publish toggle failed.';
      alert(msg);
    }
  };

  const handleDelete = async (proj: DbPortfolioProject) => {
    if (!window.confirm(`Are you sure you want to delete "${proj.title}"?`)) {
      return;
    }

    try {
      await portfolioService.deleteProject(proj.id);
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

    if (!title.trim()) {
      setErrorMsg('Project title is required.');
      return;
    }
    if (!slug.trim()) {
      setErrorMsg('Project slug is required.');
      return;
    }
    if (!thumbnailUrl.trim()) {
      setErrorMsg('Thumbnail image URL is required.');
      return;
    }

    const deliverables = deliverablesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const toolsUsed = toolsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    setSubmitting(true);

    try {
      if (editingProject) {
        await portfolioService.updateProject(editingProject.id, {
          title: title.trim(),
          slug: slug.trim().toLowerCase(),
          description: description.trim(),
          category_id: categoryId || null,
          thumbnail_url: thumbnailUrl.trim(),
          preview_video_url: previewVideoUrl.trim() || null,
          full_video_url: fullVideoUrl.trim() || null,
          aspect_ratio: aspectRatio,
          duration: duration.trim() || '00:30',
          client_industry: clientIndustry.trim() || null,
          deliverables,
          tools_used: toolsUsed,
          case_study: caseStudy.trim() || null,
          is_featured: isFeatured,
          is_published: isPublished,
          display_order: Number(displayOrder) || 0,
        });
        setSuccessMsg('Project updated successfully.');
      } else {
        await portfolioService.createProject({
          title: title.trim(),
          slug: slug.trim().toLowerCase(),
          description: description.trim(),
          category_id: categoryId || null,
          thumbnail_url: thumbnailUrl.trim(),
          preview_video_url: previewVideoUrl.trim() || null,
          full_video_url: fullVideoUrl.trim() || null,
          aspect_ratio: aspectRatio,
          duration: duration.trim() || '00:30',
          client_industry: clientIndustry.trim() || null,
          deliverables,
          tools_used: toolsUsed,
          case_study: caseStudy.trim() || null,
          is_featured: isFeatured,
          is_published: isPublished,
          display_order: Number(displayOrder) || 0,
        });
        setSuccessMsg('Project created successfully.');
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
            Portfolio Projects
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Manage public portfolio entries, video URLs, aspect ratios, and featured highlights.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="btn btn-primary"
          style={{ fontSize: '0.84rem', padding: '0.65rem 1.35rem' }}
        >
          <Plus size={16} />
          <span>Add Project</span>
        </button>
      </div>

      {/* Projects List / Table */}
      <div
        className="card-glass"
        style={{ padding: '1.5rem', backgroundColor: 'rgba(15, 15, 22, 0.8)' }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
            Loading portfolio entries...
          </div>
        ) : projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
            <Film size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4 }} />
            <p style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#ffffff', fontWeight: 600 }}>
              No portfolio projects found.
            </p>
            <p style={{ fontSize: '0.85rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
              Add your first video project to display it on the public RYNX portfolio gallery.
            </p>
            <button onClick={openAddModal} className="btn btn-primary" style={{ fontSize: '0.84rem' }}>
              Add First Project
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Project</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Format</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Featured</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((proj) => (
                  <tr
                    key={proj.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    }}
                  >
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <img
                          src={proj.thumbnail_url}
                          alt={proj.title}
                          style={{
                            width: '56px',
                            height: '36px',
                            borderRadius: '6px',
                            objectFit: 'cover',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 700, color: '#ffffff' }}>{proj.title}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                            /{proj.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '1rem', color: 'var(--gold-300)' }}>
                      {proj.category?.name || '—'}
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <span className="badge-dark" style={{ fontSize: '0.72rem' }}>
                        {proj.aspect_ratio}
                      </span>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      {proj.is_featured ? (
                        <span className="badge-gold" style={{ fontSize: '0.7rem' }}>
                          <Sparkles size={11} /> Yes
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No</span>
                      )}
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <button
                        onClick={() => handleTogglePublish(proj)}
                        style={{
                          background: proj.is_published
                            ? 'rgba(34, 197, 94, 0.12)'
                            : 'rgba(239, 68, 68, 0.12)',
                          border: `1px solid ${proj.is_published ? '#22c55e' : '#ef4444'}`,
                          color: proj.is_published ? '#86efac' : '#fca5a5',
                          borderRadius: '999px',
                          padding: '0.2rem 0.65rem',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        {proj.is_published ? <Eye size={12} /> : <EyeOff size={12} />}
                        <span>{proj.is_published ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>

                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => openEditModal(proj)}
                          aria-label="Edit project"
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
                          onClick={() => handleDelete(proj)}
                          aria-label="Delete project"
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

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '800px', padding: '2.5rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#ffffff' }}>
                {editingProject ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Apex Velocity Commercial"
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
                    Slug (URL Key) *
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. apex-velocity-commercial"
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
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                    Category
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
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
                    <option value="">Unassigned</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                    Aspect Ratio *
                  </label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value as '16:9' | '9:16' | '2.39:1')}
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
                    <option value="16:9">16:9 Landscape (YouTube/Commercial)</option>
                    <option value="9:16">9:16 Vertical (Reels/Shorts)</option>
                    <option value="2.39:1">2.39:1 Anamorphic Cinema</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                    Duration
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="00:30"
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

              {/* Media URLs */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                  Thumbnail Image URL *
                </label>
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://... (Cover image for card)"
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                    Preview Video URL (Lightweight MP4 for hover)
                  </label>
                  <input
                    type="url"
                    value={previewVideoUrl}
                    onChange={(e) => setPreviewVideoUrl(e.target.value)}
                    placeholder="https://... (CDN or external video hosting)"
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
                    Full Video URL (High-res for Lightbox player)
                  </label>
                  <input
                    type="url"
                    value={fullVideoUrl}
                    onChange={(e) => setFullVideoUrl(e.target.value)}
                    placeholder="https://... (Master video URL)"
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

              {/* Description */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                  Short Summary Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  required
                  placeholder="Concise overview of editing highlights..."
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

              {/* Case Study Details */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                  Creative Direction & Editing Breakdown (Case Study)
                </label>
                <textarea
                  value={caseStudy}
                  onChange={(e) => setCaseStudy(e.target.value)}
                  rows={3}
                  placeholder="Detailed pacing notes, color grading choices, sound Foley techniques..."
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d0d0db', marginBottom: '0.4rem' }}>
                    Tools Used (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={toolsStr}
                    onChange={(e) => setToolsStr(e.target.value)}
                    placeholder="Premiere Pro, DaVinci Resolve, After Effects"
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
                    Deliverables (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={deliverablesStr}
                    onChange={(e) => setDeliverablesStr(e.target.value)}
                    placeholder="4K UHD Master, 9:16 Social Cut"
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

              {/* Toggles */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', color: '#ffffff', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    style={{ accentColor: 'var(--gold-400)', width: '18px', height: '18px' }}
                  />
                  <span>Feature on Top of Grid</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', color: '#ffffff', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    style={{ accentColor: 'var(--gold-400)', width: '18px', height: '18px' }}
                  />
                  <span>Publish Immediately (Visible to Public)</span>
                </label>
              </div>

              {/* Modal Actions */}
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
                  {submitting ? 'Saving Project...' : editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

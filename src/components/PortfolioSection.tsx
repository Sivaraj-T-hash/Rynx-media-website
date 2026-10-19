import React, { useState, useEffect, useMemo } from 'react';
import type { DbPortfolioProject, Category } from '../types/database';
import { portfolioService } from '../services/portfolioService';
import { categoriesService } from '../services/categoriesService';
import { PortfolioFilters } from './PortfolioFilters';
import { VideoProjectCard } from './VideoProjectCard';
import { VideoPlayerModal } from './VideoPlayerModal';
import { Sparkles, ArrowDown, Film, MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../config/contactConfig';

const ITEMS_PER_PAGE = 6;

export const PortfolioSection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<DbPortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);
  const [activeModalProject, setActiveModalProject] = useState<DbPortfolioProject | null>(null);
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);

  // Fetch real categories and published projects from Supabase
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [cats, projs] = await Promise.all([
          categoriesService.getCategories(),
          portfolioService.getPublishedProjects(),
        ]);
        if (isMounted) {
          setCategories(cats);
          setProjects(projs);
        }
      } catch (err) {
        console.warn('Portfolio load notice:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute project counts per category
  const projectCounts = useMemo(() => {
    const counts: Record<string, number> = { all: projects.length };
    projects.forEach((p) => {
      if (p.category_id) {
        counts[p.category_id] = (counts[p.category_id] || 0) + 1;
      }
    });
    return counts;
  }, [projects]);

  // Filter projects based on selected virtual 'all' or category slug
  const filteredProjects = useMemo(() => {
    if (selectedCategorySlug === 'all') {
      return projects;
    }
    const matchedCategory = categories.find((c) => c.slug === selectedCategorySlug);
    if (!matchedCategory) return [];
    return projects.filter((p) => p.category_id === matchedCategory.id);
  }, [projects, selectedCategorySlug, categories]);

  const displayedProjects = useMemo(() => {
    return filteredProjects.slice(0, visibleCount);
  }, [filteredProjects, visibleCount]);

  const hasMore = visibleCount < filteredProjects.length;

  const handleCategoryChange = (slug: string) => {
    setSelectedCategorySlug(slug);
    setVisibleCount(ITEMS_PER_PAGE);
    setActivePlayingId(null);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  return (
    <section
      id="portfolio"
      style={{
        paddingTop: '6rem',
        paddingBottom: '6rem',
        position: 'relative',
        backgroundColor: '#07070b',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <span className="badge-gold">
              <Sparkles size={12} /> Featured Portfolio
            </span>
          </div>

          <h2 className="editorial-title">Work That Speaks Before We Do.</h2>

          <p>
            Every frame has a purpose. Explore the edits, stories, and visuals we bring to life.
          </p>
        </div>

        {/* Filter Pills: Displays 'All' + any published categories from Supabase */}
        <PortfolioFilters
          categories={categories}
          selectedCategorySlug={selectedCategorySlug}
          onSelectCategorySlug={handleCategoryChange}
          projectCounts={projectCounts}
        />

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                border: '3px solid rgba(212, 175, 55, 0.2)',
                borderTopColor: 'var(--gold-400)',
                borderRadius: '50%',
                margin: '0 auto 1rem auto',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <p style={{ fontSize: '0.9rem' }}>Loading portfolio masters...</p>
          </div>
        )}

        {/* Elegant Empty State: When no published projects exist */}
        {!loading && projects.length === 0 && (
          <div
            className="card-glass"
            style={{
              maxWidth: '680px',
              margin: '2rem auto',
              padding: '3.5rem 2rem',
              textAlign: 'center',
              backgroundColor: 'rgba(15, 15, 22, 0.65)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: '1.5rem',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid var(--border-gold-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
                color: 'var(--gold-400)',
              }}
            >
              <Film size={28} />
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#ffffff' }}>
              Portfolio Masters In Ingestion
            </h3>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto 2rem auto' }}>
              New client commercial masters and creator edits are being uploaded via our studio dashboard. In the meantime, message our team for private showreel links tailored to your project.
            </p>

            <a
              href={getWhatsAppUrl('Hi RYNX Team! I visited your website and would like to see sample private reels matching my upcoming project.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ padding: '0.85rem 1.85rem', fontSize: '0.92rem' }}
            >
              <MessageCircle size={16} />
              <span>Request Private Showreel</span>
            </a>
          </div>
        )}

        {/* Portfolio Responsive Grid when projects exist */}
        {!loading && projects.length > 0 && (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '1.75rem',
                alignItems: 'start',
              }}
              className="portfolio-grid"
            >
              {displayedProjects.map((project) => (
                <VideoProjectCard
                  key={project.id}
                  project={project}
                  isModalOpen={activeModalProject !== null}
                  activePlayingId={activePlayingId}
                  setActivePlayingId={setActivePlayingId}
                  onOpenModal={(proj) => setActiveModalProject(proj)}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
                <button
                  onClick={handleLoadMore}
                  className="btn btn-secondary"
                  style={{ padding: '0.85rem 2.25rem' }}
                >
                  <span>Load More Projects</span>
                  <ArrowDown size={16} color="var(--gold-400)" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox / Video Player Modal */}
      <VideoPlayerModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 640px) {
          .portfolio-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

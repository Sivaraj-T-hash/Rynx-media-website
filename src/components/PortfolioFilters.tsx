import React from 'react';
import type { Category } from '../types/database';

interface PortfolioFiltersProps {
  categories: Category[];
  selectedCategorySlug: string;
  onSelectCategorySlug: (slug: string) => void;
  projectCounts: Record<string, number>;
}

export const PortfolioFilters: React.FC<PortfolioFiltersProps> = ({
  categories,
  selectedCategorySlug,
  onSelectCategorySlug,
  projectCounts,
}) => {
  // Always include the virtual 'All' filter first
  const allCount = projectCounts['all'] || 0;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '0.65rem',
        marginBottom: '3rem',
        padding: '0.5rem',
      }}
    >
      {/* Virtual 'All' filter - never stored in DB */}
      <button
        onClick={() => onSelectCategorySlug('all')}
        style={{
          padding: '0.6rem 1.15rem',
          borderRadius: '9999px',
          fontFamily: 'var(--font-heading)',
          fontSize: '0.86rem',
          fontWeight: selectedCategorySlug === 'all' ? 700 : 500,
          letterSpacing: '0.01em',
          cursor: 'pointer',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          border:
            selectedCategorySlug === 'all'
              ? '1px solid var(--gold-400)'
              : '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor:
            selectedCategorySlug === 'all'
              ? 'rgba(212, 175, 55, 0.16)'
              : 'rgba(16, 16, 24, 0.65)',
          color: selectedCategorySlug === 'all' ? 'var(--gold-300)' : 'var(--text-secondary)',
          boxShadow: selectedCategorySlug === 'all' ? '0 0 20px rgba(212, 175, 55, 0.2)' : 'none',
          backdropFilter: 'blur(10px)',
          outline: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span>All</span>
        {allCount > 0 && (
          <span
            style={{
              fontSize: '0.72rem',
              padding: '0.1rem 0.45rem',
              borderRadius: '999px',
              backgroundColor:
                selectedCategorySlug === 'all'
                  ? 'rgba(212, 175, 55, 0.3)'
                  : 'rgba(255, 255, 255, 0.08)',
              color: selectedCategorySlug === 'all' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: 600,
            }}
          >
            {allCount}
          </span>
        )}
      </button>

      {/* Dynamic categories fetched from Supabase */}
      {categories.map((category) => {
        const isSelected = selectedCategorySlug === category.slug;
        const count = projectCounts[category.id] || 0;

        return (
          <button
            key={category.id}
            onClick={() => onSelectCategorySlug(category.slug)}
            style={{
              padding: '0.6rem 1.15rem',
              borderRadius: '9999px',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.86rem',
              fontWeight: isSelected ? 700 : 500,
              letterSpacing: '0.01em',
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              border: isSelected
                ? '1px solid var(--gold-400)'
                : '1px solid rgba(255, 255, 255, 0.08)',
              backgroundColor: isSelected
                ? 'rgba(212, 175, 55, 0.16)'
                : 'rgba(16, 16, 24, 0.65)',
              color: isSelected ? 'var(--gold-300)' : 'var(--text-secondary)',
              boxShadow: isSelected ? '0 0 20px rgba(212, 175, 55, 0.2)' : 'none',
              backdropFilter: 'blur(10px)',
              outline: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span>{category.name}</span>
            {count > 0 && (
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '999px',
                  backgroundColor: isSelected
                    ? 'rgba(212, 175, 55, 0.3)'
                    : 'rgba(255, 255, 255, 0.08)',
                  color: isSelected ? '#ffffff' : 'var(--text-muted)',
                  fontWeight: 600,
                }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

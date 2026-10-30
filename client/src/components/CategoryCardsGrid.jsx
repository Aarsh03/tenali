import React from 'react';
import { calculateSectionProgress } from '../features/progress';
import './CategoryCardsGrid.css';

/**
 * CategoryCardsGrid
 * Displays the Category Cards on the Home screen outer view.
 */
export default function CategoryCardsGrid({
  sections = [],
  tiles = [],
  completedTopics = [],
  goldMastery = [],
  onSelectSection,
  onSelect,
  id,
}) {
  return (
    <div className="section-cards-grid" id={id}>
      {sections.map((section) => {
        const sectionTiles = tiles.filter(
          (app) => (app.category || 'shelf') === section.key
        );
        const { completedCount, goldCount } = calculateSectionProgress(
          sectionTiles,
          completedTopics,
          goldMastery
        );

        return (
          <button
            key={section.key}
            type="button"
            className={`section-category-card ${section.color || 'blue'}`}
            onClick={() => {
              if (section.directMode && onSelect) {
                onSelect(section.directMode);
              } else if (onSelectSection) {
                onSelectSection(section.key);
              }
            }}
          >
            <div className="section-card-top">
              <span className="section-card-icon">{section.icon}</span>
              <span className="section-card-badge">
                {section.directMode ? 'Interactive Hub' : `${sectionTiles.length} Puzzles`}
              </span>
            </div>
            <div className="section-card-main">
              <h3 className="section-card-title">{section.title}</h3>
              <p className="section-card-desc">{section.subtitle}</p>
            </div>
            <div className="section-card-footer">
              <div className="section-card-progress">
                {!section.directMode && (
                  <span className="progress-fraction">
                    {completedCount}/{sectionTiles.length}
                  </span>
                )}
                {goldCount > 0 && (
                  <span className="progress-pill gold" title="Gold Mastery">
                    🥇 {goldCount}
                  </span>
                )}
              </div>
              <span className="section-card-cta">
                {section.directMode ? 'Launch →' : 'Explore →'}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

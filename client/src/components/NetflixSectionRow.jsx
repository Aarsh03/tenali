import React, { useRef, useState, useEffect, useCallback } from 'react';
import './NetflixSectionRow.css';

/**
 * NetflixSectionRow
 * Renders a single categorized section as a Netflix-style horizontal carousel
 * with left/right smooth sliding arrows, and an inline expand/collapse full grid toggle.
 */
export default function NetflixSectionRow({
  section,
  tiles = [],
  completedTopics = [],
  goldMastery = [],
  onSelect,
  isStage3Completed,
  navigate,
  isSearchMode = false,
}) {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const checkScroll = useCallback(() => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    // Allow a small 5px threshold for sub-pixel rendering
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = trackRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
    }
    window.addEventListener('resize', checkScroll);
    return () => {
      if (el) {
        el.removeEventListener('scroll', checkScroll);
      }
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, tiles.length, isExpanded]);

  const handleScroll = (direction) => {
    if (!trackRef.current) return;
    const amount = trackRef.current.clientWidth * 0.75;
    trackRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  if (!tiles || tiles.length === 0) return null;

  const completedCount = tiles.filter((app) => isStage3Completed(app.key, completedTopics)).length;
  const goldCount = tiles.filter((app) => goldMastery && goldMastery.includes(app.key)).length;

  // In search mode, show as a grid directly without arrows for instant visibility
  const showGrid = isSearchMode || isExpanded;

  return (
    <section className="flix-section-row" id={`flix-${section.key}`}>
      <div className="flix-header">
        <div className="flix-title-group">
          {section.icon && <span className="flix-section-icon">{section.icon}</span>}
          <h2 className="flix-section-title">{section.title}</h2>
          <span className="flix-count-badge">{tiles.length}</span>
          {goldCount > 0 && (
            <span className="flix-mini-badge gold" title="Gold Mastery">
              🥇 {goldCount}
            </span>
          )}
          {completedCount > 0 && (
            <span className="flix-mini-badge completed" title="Completed">
              ✓ {completedCount}
            </span>
          )}
        </div>

        {!isSearchMode && tiles.length > 3 && (
          <button
            type="button"
            className="flix-toggle-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? `Collapse ${section.title} row` : `Explore all ${tiles.length} ${section.title} puzzles`}
          >
            {isExpanded ? (
              <>
                <span>Collapse Row</span>
                <span className="flix-toggle-chevron">▴</span>
              </>
            ) : (
              <>
                <span>Explore All ({tiles.length})</span>
                <span className="flix-toggle-chevron">▾</span>
              </>
            )}
          </button>
        )}
      </div>

      {showGrid ? (
        <div className="menu-grid flix-expanded-grid">
          {tiles.map((app) => {
            const isGold = goldMastery && goldMastery.includes(app.key);
            const isCompleted = isStage3Completed(app.key, completedTopics);
            return (
              <button
                key={app.key}
                type="button"
                className={`menu-card ${isGold ? 'gold-card' : app.color}`}
                onClick={() => {
                  if (app.isRedirect) {
                    navigate(app.path);
                  } else {
                    onSelect(app.key);
                  }
                }}
              >
                <span className="menu-title">
                  {app.name}
                  {isGold && <span className="badge-indicator">🥇</span>}
                  {!isGold && isCompleted && <span className="badge-indicator">✅</span>}
                </span>
                <span className="menu-subtitle">{app.subtitle}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flix-carousel-container">
          <button
            type="button"
            className={`flix-arrow flix-arrow-left ${!canScrollLeft ? 'hidden' : ''}`}
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label={`Scroll ${section.title} left`}
          >
            ‹
          </button>

          <div className="flix-track" ref={trackRef}>
            {tiles.map((app) => {
              const isGold = goldMastery && goldMastery.includes(app.key);
              const isCompleted = isStage3Completed(app.key, completedTopics);
              return (
                <button
                  key={app.key}
                  type="button"
                  className={`menu-card flix-card ${isGold ? 'gold-card' : app.color}`}
                  onClick={() => {
                    if (app.isRedirect) {
                      navigate(app.path);
                    } else {
                      onSelect(app.key);
                    }
                  }}
                >
                  <span className="menu-title">
                    {app.name}
                    {isGold && <span className="badge-indicator">🥇</span>}
                    {!isGold && isCompleted && <span className="badge-indicator">✅</span>}
                  </span>
                  <span className="menu-subtitle">{app.subtitle}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className={`flix-arrow flix-arrow-right ${!canScrollRight ? 'hidden' : ''}`}
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label={`Scroll ${section.title} right`}
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}

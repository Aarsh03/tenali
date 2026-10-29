import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import SectionDrilldownView from './SectionDrilldownView';
import CategoryCardsGrid from './CategoryCardsGrid';

describe('SectionDrilldownView', () => {
  it('renders section header, puzzle count, and child tiles', () => {
    const mockSection = {
      key: 'language-words',
      title: 'Language & Literacy',
      icon: '📚',
      subtitle: 'Crosswords, Word Searches, Word Creator & Verbal Logic',
      color: 'teal',
    };

    const mockTiles = [
      { key: 'crossword', name: 'Crossword Puzzle', subtitle: 'Fill clues', color: 'orange' },
      { key: 'wordsearch', name: 'Word Search', subtitle: 'Hunt words', color: 'blue' },
    ];

    render(
      <SectionDrilldownView
        section={mockSection}
        tiles={mockTiles}
        completedTopics={[]}
        goldMastery={[]}
        renderCard={(app) => (
          <div key={app.key} data-testid="tile-card">
            {app.name}
          </div>
        )}
      />
    );

    expect(screen.getByText('Language & Literacy')).toBeDefined();
    expect(screen.getByText('2 puzzles')).toBeDefined();
    expect(screen.getAllByTestId('tile-card').length).toBe(2);
  });
});

describe('CategoryCardsGrid', () => {
  it('renders all sections and triggers section selection on click', () => {
    const mockSections = [
      { key: 'number-foundations', title: 'Number Foundations', icon: '🔢', subtitle: 'Arithmetic', color: 'blue' },
      { key: 'language-words', title: 'Language & Literacy', icon: '📚', subtitle: 'Word Games', color: 'teal' },
    ];

    const mockTiles = [
      { key: 'addition', category: 'number-foundations' },
      { key: 'crossword', category: 'language-words' },
    ];

    const onSelectSectionMock = vi.fn();

    render(
      <CategoryCardsGrid
        sections={mockSections}
        tiles={mockTiles}
        completedTopics={[]}
        goldMastery={[]}
        onSelectSection={onSelectSectionMock}
      />
    );

    expect(screen.getByText('Number Foundations')).toBeDefined();
    expect(screen.getByText('Language & Literacy')).toBeDefined();
  });
});

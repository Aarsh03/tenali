// Auto-generated module registry.
// Thanks to Vite's import.meta.glob, adding a new feature is now perfectly modular (OCP compliant).
// Just create a new folder in features/ with an index.js exporting metadata!

const featureModules = import.meta.glob('./*/index.js', { eager: true });

export const TILES = Object.values(featureModules)
  .map(mod => mod.metadata)
  .filter(Boolean);

export const FEATURED_TILES = [
    { key: 'randommix', name: 'Random Mix', subtitle: 'Adaptive cross-topic quiz', color: 'featured' },
    { key: 'custom', name: 'Custom Lesson', subtitle: 'Build your own mixed quiz', color: 'featured' },
    { key: 'gym', name: 'Gym', subtitle: 'Adaptive workout across all 7 gym puzzles', color: 'featured' },
    { key: 'treasurehunt', name: 'Treasure Hunt', subtitle: 'Solve & seek on a treasure grid', color: 'featured' },
    { key: 'contrastlist', name: 'Contrast Challenge', subtitle: 'Distinguish similar concepts', color: 'featured' },
    { key: 'vachana', name: 'Vachana', subtitle: 'Mathematical Literacy Lab', color: 'featured' },
];

export const MATH_LAB_ENTRY = { key: 'math-lab', name: 'Visual Learning Universe', subtitle: 'Visual, Mensuration & Addition labs', color: 'orange' };
export const GEOCRAFT_ENTRY = { key: 'geocraft', name: 'GeoCraft', subtitle: 'Interactive Geometry Lab', color: 'featured' };

export default TILES;

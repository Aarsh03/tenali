# Feature Module Template

This directory serves as the template for a self-contained feature module (e.g., a specific quiz app like 'AdaptiveTables').

## Structure
- index.js - The public API for this feature (exports the main app component).
- AppName.jsx - The main container component for the feature.
- components/ - Sub-components used ONLY by this feature.
- hooks/ - Custom logic used ONLY by this feature.
- utils/ - Helper functions used ONLY by this feature.

## SWE Principles
1. **Self-Contained**: A feature module should not reach into other features. It can only import from its own folders or from the global src/shared/ directory.
2. **Expose Only What's Needed**: Only export the main app container from index.js. Internal components should remain private.

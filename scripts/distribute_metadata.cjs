const fs = require('fs');
const path = require('path');

const featuresDir = path.join(__dirname, '../client/src/features');
const tilesFile = path.join(__dirname, '../client/src/features/tiles.js');

let tilesCode = fs.readFileSync(tilesFile, 'utf8');

const match = tilesCode.match(/export const TILES = \[\s*([\s\S]*?)\s*\]/);
if (!match) {
    console.error("Could not find TILES array");
    process.exit(1);
}

const tilesContent = match[1];
const entries = tilesContent.split('\n').filter(line => line.trim().startsWith('{'));

let distributedCount = 0;
let missedKeys = [];

entries.forEach(entry => {
    const keyMatch = entry.match(/key:\s*'([^']+)'/);
    if (!keyMatch) return;
    const key = keyMatch[1];
    
    let folderName = key.replace(/-/g, '') + 'app';
    
    if (!fs.existsSync(path.join(featuresDir, folderName))) {
        folderName = key.replace(/-/g, '');
        if (!fs.existsSync(path.join(featuresDir, folderName))) {
            missedKeys.push(key);
            return;
        }
    }
    
    const featurePath = path.join(featuresDir, folderName);
    const files = fs.readdirSync(featurePath);
    const jsxFile = files.find(f => f.endsWith('.jsx'));
    if (!jsxFile) {
        missedKeys.push(key);
        return;
    }
    
    const componentName = jsxFile.replace('.jsx', '');
    
    const indexCode = "import " + componentName + " from './" + jsxFile + "';\n\n" +
"export const metadata = " + entry.trim().replace(/,$/, '') + ";\n\n" +
"export default " + componentName + ";\n";

    fs.writeFileSync(path.join(featurePath, 'index.js'), indexCode);
    distributedCount++;
});

console.log('Successfully distributed metadata to ' + distributedCount + ' feature modules.');
console.log('Missed keys: ' + missedKeys.join(', '));

const newTilesCode = "// Auto-generated module registry.\n" +
"// Thanks to Vite's import.meta.glob, adding a new feature is now perfectly modular (OCP compliant).\n" +
"// Just create a new folder in features/ with an index.js exporting metadata!\n\n" +
"const featureModules = import.meta.glob('./*/index.js', { eager: true });\n\n" +
"export const TILES = Object.values(featureModules)\n" +
"  .map(mod => mod.metadata)\n" +
"  .filter(Boolean);\n\n" +
"export const FEATURED_TILES = [\n" +
"    { key: 'randommix', name: 'Random Mix', subtitle: 'Adaptive cross-topic quiz', color: 'featured' },\n" +
"    { key: 'custom', name: 'Custom Lesson', subtitle: 'Build your own mixed quiz', color: 'featured' },\n" +
"    { key: 'gym', name: 'Gym', subtitle: 'Adaptive workout across all 7 gym puzzles', color: 'featured' },\n" +
"    { key: 'treasurehunt', name: 'Treasure Hunt', subtitle: 'Solve & seek on a treasure grid', color: 'featured' },\n" +
"    { key: 'contrastlist', name: 'Contrast Challenge', subtitle: 'Distinguish similar concepts', color: 'featured' },\n" +
"    { key: 'vachana', name: 'Vachana', subtitle: 'Mathematical Literacy Lab', color: 'featured' },\n" +
"];\n\n" +
"export const MATH_LAB_ENTRY = { key: 'math-lab', name: 'Visual Learning Universe', subtitle: 'Visual, Mensuration & Addition labs', color: 'orange' };\n" +
"export const GEOCRAFT_ENTRY = { key: 'geocraft', name: 'GeoCraft', subtitle: 'Interactive Geometry Lab', color: 'featured' };\n\n" +
"export default TILES;\n";

fs.writeFileSync(tilesFile, newTilesCode);
console.log('tiles.js successfully updated to dynamic registry.');

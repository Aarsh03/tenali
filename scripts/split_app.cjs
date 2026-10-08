const fs = require('fs');
const path = require('path');

const APP_JSX_PATH = path.join(__dirname, '../client/src/App.jsx');
const FEATURES_DIR = path.join(__dirname, '../client/src/features');

let content = fs.readFileSync(APP_JSX_PATH, 'utf8');

const componentRegex = /(?:function\s+([A-Z]\w+)\s*\([^)]*\)\s*\{|const\s+([A-Z]\w+)\s*=\s*makeQuizApp\(\{)/g;

let matches = [...content.matchAll(componentRegex)];
console.log('Found ' + matches.length + ' components/apps to split.');

matches.forEach(match => {
    const componentName = match[1] || match[2];
    const featureFolder = path.join(FEATURES_DIR, componentName.toLowerCase());
    
    if (!fs.existsSync(featureFolder)) {
        fs.mkdirSync(featureFolder, { recursive: true });
    }
    
    const scaffoldPath = path.join(featureFolder, componentName + '.jsx');
    if (!fs.existsSync(scaffoldPath)) {
        fs.writeFileSync(scaffoldPath, 'import React from "react";\n\nexport default function ' + componentName + '() {\n  // Extracted from App.jsx\n}\n');
    }
});

console.log('Feature scaffolding generated successfully in client/src/features/');

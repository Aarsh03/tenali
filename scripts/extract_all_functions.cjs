const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../client/src/App.jsx');
const mathUtilsPath = path.join(__dirname, '../client/src/shared/mathUtils.js');
const gameEnginePath = path.join(__dirname, '../client/src/shared/gameEngine.js');

let code = fs.readFileSync(appPath, 'utf8');

// Match unction X or const X = (...) => {
// Let's stick to unction X first as we saw they were all unction ch1_gcd etc.
const startRegex = /^(?:export\s+)?function\s+([a-zA-Z0-9_]+)\s*\(/gm;

let extractions = [];
let match;

// Keep safe list
const KEEP = ['App', 'LandingPage', 'BorrowRow', 'MatrixInput', 'Frac', 'AppRouter'];

while ((match = startRegex.exec(code)) !== null) {
    const name = match[1];
    if (KEEP.includes(name)) continue;
    
    let startIndex = match.index;
    let i = startIndex;
    let depth = 0;
    let started = false;
    let inString = false;
    let stringChar = '';
    let endIndex = -1;
    
    while(i < code.length) {
        const char = code[i];
        
        if (!inString && (char === '"' || char === "'" || char === String.fromCharCode(96))) {
            inString = true;
            stringChar = char;
            i++;
            continue;
        }
        if (inString && char === '\\') { i+=2; continue; }
        if (inString && char === stringChar) { inString = false; i++; continue; }
        if (inString) { i++; continue; }
        
        if (char === '{') {
            depth++;
            started = true;
        } else if (char === '}') {
            depth--;
            if (started && depth === 0) {
                endIndex = i;
                break;
            }
        }
        i++;
    }
    
    if (endIndex !== -1) {
        extractions.push({
            name,
            start: startIndex,
            end: endIndex + 1,
            content: code.substring(startIndex, endIndex + 1)
        });
    }
}

extractions.sort((a,b) => b.start - a.start);

let mathUtilsContent = "// Auto-extracted math utilities (Chapters 1-24 and more)\n\n";
let gameEngineContent = "// Auto-extracted game engine functions (gym, gen_*, etc)\n\n";

let mathNames = [];
let gameNames = [];

extractions.forEach(ext => {
    let content = ext.content;
    if (!content.startsWith('export')) {
        content = 'export ' + content;
    }
    
    if (ext.name.startsWith('gym') || ext.name.startsWith('gen_') || ext.name.startsWith('build') || ext.name.includes('Stat') || ext.name.includes('Mastery')) {
        gameEngineContent += content + "\n\n";
        gameNames.push(ext.name);
    } else {
        mathUtilsContent += content + "\n\n";
        mathNames.push(ext.name);
    }
    
    code = code.substring(0, ext.start) + code.substring(ext.end);
});

fs.writeFileSync(mathUtilsPath, mathUtilsContent);
fs.writeFileSync(gameEnginePath, gameEngineContent);

// Add imports to App.jsx
let importStr = "";
if (mathNames.length > 0) importStr += "import { " + mathNames.reverse().join(', ') + " } from './shared/mathUtils.js';\n";
if (gameNames.length > 0) importStr += "import { " + gameNames.reverse().join(', ') + " } from './shared/gameEngine.js';\n";

const reactImportIdx = code.indexOf("import React");
if (reactImportIdx !== -1) {
    const endOfLine = code.indexOf('\n', reactImportIdx);
    code = code.substring(0, endOfLine + 1) + importStr + code.substring(endOfLine + 1);
} else {
    code = importStr + code;
}

// Clean up massive blank spaces
code = code.replace(/\n\s*\n\s*\n/g, '\n\n');

fs.writeFileSync(appPath, code);

console.log("Extracted " + mathNames.length + " math functions to shared/mathUtils.js");
console.log("Extracted " + gameNames.length + " game engine functions to shared/gameEngine.js");

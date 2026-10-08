const fs = require('fs');
let content = fs.readFileSync('client/eslint.config.js', 'utf8');
content = content.replace(
  "import reactRefresh from 'eslint-plugin-react-refresh'",
  "import reactRefresh from 'eslint-plugin-react-refresh'\nimport unusedImports from 'eslint-plugin-unused-imports'"
);
content = content.replace(
  "rules: {",
  "plugins: { 'unused-imports': unusedImports },\n    rules: {\n      'unused-imports/no-unused-imports': 'error',\n      'unused-imports/no-unused-vars': ['warn', { 'vars': 'all', 'varsIgnorePattern': '^_', 'args': 'after-used', 'argsIgnorePattern': '^_' }],"
);
content = content.replace(
  "'no-unused-vars':",
  "// 'no-unused-vars':"
);
fs.writeFileSync('client/eslint.config.js', content);

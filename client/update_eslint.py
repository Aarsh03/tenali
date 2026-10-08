import re

with open('client/eslint.config.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(\"import reactRefresh from 'eslint-plugin-react-refresh'\", \"import reactRefresh from 'eslint-plugin-react-refresh'\\nimport unusedImports from 'eslint-plugin-unused-imports'\")

new_rules = '''plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { 'vars': 'all', 'varsIgnorePattern': '^_', 'args': 'after-used', 'argsIgnorePattern': '^_' }
      ],'''

content = content.replace(\"rules: {\", new_rules)
content = content.replace(\"'no-unused-vars':\", \"// 'no-unused-vars':\")

with open('client/eslint.config.js', 'w', encoding='utf-8') as f:
    f.write(content)

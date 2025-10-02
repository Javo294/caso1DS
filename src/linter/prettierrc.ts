
/**
 * Prettier Configuration for 20minCoach Frontend
 * This configuration ensures consistent code formatting across the project
 */

const prettierConfig = {
  // Line length before wrapping
  printWidth: 80,
  
  // Number of spaces per indentation level
  tabWidth: 2,
  
  // Use spaces instead of tabs
  useTabs: false,
  
  // Add semicolons at the end of statements
  semi: true,
  
  // Use single quotes instead of double quotes
  singleQuote: true,
  
  // Quote properties in objects only when necessary
  quoteProps: 'as-needed',
  
  // Use single quotes in JSX
  jsxSingleQuote: true,
  
  // Add trailing commas where valid in ES5 (objects, arrays, etc.)
  trailingComma: 'es5',
  
  // Add spaces between brackets in object literals
  bracketSpacing: true,
  
  // Put the > of a multi-line JSX element at the end of the last line
  bracketSameLine: false,
  
  // Include parentheses around a sole arrow function parameter
  arrowParens: 'avoid',
  
  // Format only files that are supported by Prettier
  requirePragma: false,
  
  // Insert @format pragma into file header
  insertPragma: false,
  
  // Respect .prettierignore files
  ignorePath: '.prettierignore',
  
  // Line endings (lf for Linux/Mac, crlf for Windows)
  endOfLine: 'lf',
  
  // Control how Prettier formats quoted code embedded in the file
  embeddedLanguageFormatting: 'auto',
  
  // HTML whitespace sensitivity
  htmlWhitespaceSensitivity: 'css',
  
  // Vue files script and style tags indentation
  vueIndentScriptAndStyle: false,
  
  // Override configuration for specific files
  overrides: [
    {
      files: '*.html',
      options: {
        parser: 'html'
      }
    },
    {
      files: '*.component.html',
      options: {
        parser: 'angular'
      }
    },
    {
      files: '*.md',
      options: {
        parser: 'markdown',
        proseWrap: 'always'
      }
    },
    {
      files: '*.json',
      options: {
        parser: 'json'
      }
    },
    {
      files: ['*.ts', '*.tsx'],
      options: {
        parser: 'typescript'
      }
    }
  ]
};

export default prettierConfig;

/**
 * ESLint Integration Instructions for Developers:
 * 
 * 1. Install ESLint and Prettier in your IDE:
 *    - VS Code: Install "ESLint" and "Prettier - Code formatter" extensions
 * 
 * 2. Configure VS Code settings (settings.json):
 * {
 *   "editor.formatOnSave": true,
 *   "editor.defaultFormatter": "esbenp.prettier-vscode",
 *   "editor.codeActionsOnSave": {
 *     "source.fixAll.eslint": true
 *   },
 *   "eslint.validate": [
 *     "javascript",
 *     "javascriptreact",
 *     "typescript",
 *     "typescriptreact"
 *   ]
 * }
 * 
 * 3. Project ESLint configuration is in /.eslintrc.js
 * 4. Prettier configuration is in this file (/src/linter/prettierrc.ts)
 * 
 * 5. Available npm scripts:
 *    - "lint": "eslint 'src/**/*.{ts,tsx}' --fix"
 *    - "format": "prettier --write 'src/**/*.{ts,tsx,json,css,md}'"
 *    - "lint:check": "eslint 'src/**/*.{ts,tsx}'"
 *    - "format:check": "prettier --check 'src/**/*.{ts,tsx,json,css,md}'"
 * 
 * 6. The project uses Husky and lint-staged for pre-commit hooks
 */

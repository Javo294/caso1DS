/**
 * Basic Commands and Scripts for 20minCoach Development
 * This file documents all essential commands for development, testing, and deployment
 */

export const BasicCommands = {
  // Development Commands
  DEVELOPMENT: {
    START_DEV: {
      command: 'pnpm dev',
      description: 'Start development server with hot reload',
      usage: 'Runs the app in development mode on http://localhost:3000'
    },
    START_DEV_HTTPS: {
      command: 'pnpm dev:https',
      description: 'Start development server with HTTPS',
      usage: 'Useful for testing features that require secure context'
    },
    TYPE_CHECK: {
      command: 'pnpm type-check',
      description: 'Run TypeScript compiler check',
      usage: 'Check for TypeScript errors without emitting files'
    },
    STORYBOOK: {
      command: 'pnpm storybook',
      description: 'Start Storybook for component development',
      usage: 'Runs Storybook on http://localhost:6006'
    }
  },

  // Testing Commands
  TESTING: {
    TEST: {
      command: 'pnpm test',
      description: 'Run all tests',
      usage: 'Execute unit tests with Jest'
    },
    TEST_WATCH: {
      command: 'pnpm test:watch',
      description: 'Run tests in watch mode',
      usage: 'Automatically re-run tests when files change'
    },
    TEST_COVERAGE: {
      command: 'pnpm test:coverage',
      description: 'Run tests with coverage report',
      usage: 'Generate coverage report in coverage/ directory'
    },
    TEST_E2E: {
      command: 'pnpm test:e2e',
      description: 'Run end-to-end tests',
      usage: 'Execute Cypress e2e tests'
    },
    TEST_E2E_HEADLESS: {
      command: 'pnpm test:e2e:headless',
      description: 'Run e2e tests in headless mode',
      usage: 'Run Cypress tests without GUI'
    }
  },

  // Code Quality Commands
  CODE_QUALITY: {
    LINT: {
      command: 'pnpm lint',
      description: 'Run ESLint with auto-fix',
      usage: 'Check and fix code style issues'
    },
    LINT_CHECK: {
      command: 'pnpm lint:check',
      description: 'Run ESLint without fixing',
      usage: 'Check for code style issues'
    },
    FORMAT: {
      command: 'pnpm format',
      description: 'Format code with Prettier',
      usage: 'Auto-format all source files'
    },
    FORMAT_CHECK: {
      command: 'pnpm format:check',
      description: 'Check code formatting',
      usage: 'Verify code formatting without changes'
    },
    AUDIT: {
      command: 'pnpm audit',
      description: 'Run security audit',
      usage: 'Check for vulnerable dependencies'
    }
  },

  // Build Commands
  BUILD: {
    BUILD_DEV: {
      command: 'pnpm build:dev',
      description: 'Build for development',
      usage: 'Create development build with source maps'
    },
    BUILD_PROD: {
      command: 'pnpm build',
      description: 'Build for production',
      usage: 'Create optimized production build'
    },
    BUILD_ANALYZE: {
      command: 'pnpm build:analyze',
      description: 'Build with bundle analysis',
      usage: 'Generate bundle analysis report'
    },
    PREVIEW: {
      command: 'pnpm preview',
      description: 'Preview production build',
      usage: 'Serve production build locally for testing'
    }
  },

  // Deployment Commands
  DEPLOYMENT: {
    DEPLOY_DEV: {
      command: 'pnpm deploy:dev',
      description: 'Deploy to development environment',
      usage: 'Deploy to Vercel preview deployment'
    },
    DEPLOY_STAGING: {
      command: 'pnpm deploy:staging',
      description: 'Deploy to staging environment',
      usage: 'Deploy to staging.20mincoach.com'
    },
    DEPLOY_PROD: {
      command: 'pnpm deploy:prod',
      description: 'Deploy to production',
      usage: 'Deploy to app.20mincoach.com'
    }
  },

  // Utility Commands
  UTILITIES: {
    CLEAN: {
      command: 'pnpm clean',
      description: 'Clean build artifacts',
      usage: 'Remove dist/, coverage/, and other generated directories'
    },
    DEPS_CHECK: {
      command: 'pnpm deps:check',
      description: 'Check for outdated dependencies',
      usage: 'List outdated npm packages'
    },
    DEPS_UPDATE: {
      command: 'pnpm deps:update',
      description: 'Update dependencies',
      usage: 'Update packages to latest versions'
    },
    GENERATE_COMPONENT: {
      command: 'pnpm generate:component',
      description: 'Generate new component',
      usage: 'Scaffold new React component with tests and stories'
    }
  },

  // Pipeline Stages Documentation
  PIPELINE_STAGES: {
    DEVELOPMENT: [
      'Code writing',
      'Type checking (pnpm type-check)',
      'Local testing (pnpm test)',
      'Development server (pnpm dev)'
    ],
    PRE_COMMIT: [
      'Linting (pnpm lint)',
      'Formatting (pnpm format)',
      'Unit tests (pnpm test)',
      'Type checking (pnpm type-check)'
    ],
    CI_CD: [
      'Install dependencies',
      'Lint and format check',
      'Type checking',
      'Unit tests with coverage',
      'Build verification',
      'E2E tests (staging only)',
      'Security audit',
      'Deploy to environment'
    ],
    PRODUCTION_DEPLOYMENT: [
      'Code merged to main branch',
      'Automated CI/CD pipeline starts',
      'Run full test suite',
      'Build production bundle',
      'Security scanning',
      'Deploy to production',
      'Run smoke tests',
      'Monitor error rates'
    ]
  },

  // Environment-Specific Setup
  ENVIRONMENT_SETUP: {
    DEVELOPMENT: `
# Development Environment Setup

1. Clone repository
2. Run \`pnpm install\`
3. Copy \`.env.example\` to \`.env.development\`
4. Configure environment variables:
   - API endpoints
   - Auth0/Cognito settings
   - Feature flags
5. Run \`pnpm dev\` to start development server

Required tools:
- Node.js 18+
- pnpm
- Git
    `,
    
    PRODUCTION: `
# Production Environment Setup (Vercel)

1. Connect repository to Vercel
2. Configure environment variables in Vercel dashboard:
   - VITE_API_URL
   - VITE_WS_URL
   - VITE_SENTRY_DSN
   - VITE_COGNITO_USER_POOL_ID
   - VITE_COGNITO_CLIENT_ID
   - VITE_STRIPE_PUBLISHABLE_KEY
3. Set up custom domain
4. Configure SSL certificates
5. Set up monitoring and alerts

Deployment is automatic on git push to main branch.
    `
  }
};

export default BasicCommands;

/**
 * Quick Start Guide for New Developers:
 * 
 * 1. Setup:
 *    pnpm install
 *    cp .env.example .env.development
 *    
 * 2. Development:
 *    pnpm dev
 *    
 * 3. Testing:
 *    pnpm test
 *    pnpm test:watch
 *    
 * 4. Code Quality:
 *    pnpm lint
 *    pnpm format
 *    
 * 5. Build:
 *    pnpm build
 *    pnpm preview
 */

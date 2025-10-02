/**
 * Application-wide constants
 * This file contains all the constants used across the application
 */

// Session constants
export const SESSION = {
  DURATION_MINUTES: 20,
  MAX_DURATION: 20,
  WARNING_TIME: 5, // minutes before session ends
  STATES: {
    REQUESTED: 'requested',
    ACCEPTED: 'accepted',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  } as const,
};

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  BASIC: {
    NAME: 'Basic',
    PRICE: 19.99,
    SESSIONS: 2,
    FEATURES: [
      '2 sessions per month',
      'Basic support',
      'Email notifications',
    ],
  },
  PREMIUM: {
    NAME: 'Premium',
    PRICE: 59.99,
    SESSIONS: 8,
    FEATURES: [
      '8 sessions per month',
      'Priority support',
      'Push notifications',
      'Advanced search filters',
    ],
  },
} as const;

// Countries for the first year of operations
export const COUNTRIES = ['Colombia', 'Brasil'] as const;

// API configuration
export const API = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  THEME: '20mincoach-theme',
  AUTH_TOKEN: '20mincoach-auth-token',
  USER_PREFERENCES: '20mincoach-user-preferences',
  RECENT_SEARCHES: '20mincoach-recent-searches',
  SESSION_FILTERS: '20mincoach-session-filters',
} as const;

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_CHAT_HISTORY: true,
  ENABLE_ADVANCED_FILTERS: true,
  ENABLE_SESSION_RECORDING: false,
} as const;

// User roles and permissions
export const ROLES = {
  BASIC_USER: 'basic-user',
  PREMIUM_USER: 'premium-user',
  COACH: 'coach',
  ADMIN: 'admin',
} as const;

export const PERMISSIONS = {
  // Session permissions
  SESSION_CREATE: 'session:create',
  SESSION_READ: 'session:read',
  SESSION_UPDATE: 'session:update',
  SESSION_DELETE: 'session:delete',
  SESSION_START: 'session:start',
  SESSION_END: 'session:end',
  SESSION_RATE: 'session:rate',

  // Coach permissions
  COACH_READ: 'coach:read',
  COACH_UPDATE: 'coach:update',
  COACH_AVAILABILITY: 'coach:availability',

  // User permissions
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',

  // Admin permissions
  ADMIN_ALL: 'admin:all',
} as const;

// Role-based permission mappings
export const ROLE_PERMISSIONS = {
  [ROLES.BASIC_USER]: [
    PERMISSIONS.SESSION_CREATE,
    PERMISSIONS.SESSION_READ,
    PERMISSIONS.SESSION_RATE,
    PERMISSIONS.COACH_READ,
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_UPDATE,
  ],
  [ROLES.PREMIUM_USER]: [
    PERMISSIONS.SESSION_CREATE,
    PERMISSIONS.SESSION_READ,
    PERMISSIONS.SESSION_RATE,
    PERMISSIONS.COACH_READ,
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_UPDATE,
  ],
  [ROLES.COACH]: [
    PERMISSIONS.SESSION_READ,
    PERMISSIONS.SESSION_UPDATE,
    PERMISSIONS.SESSION_START,
    PERMISSIONS.SESSION_END,
    PERMISSIONS.COACH_READ,
    PERMISSIONS.COACH_UPDATE,
    PERMISSIONS.COACH_AVAILABILITY,
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_UPDATE,
  ],
  [ROLES.ADMIN]: [
    PERMISSIONS.ADMIN_ALL,
  ],
} as const;

// Error codes
export const ERROR_CODES = {
  // Authentication errors
  AUTH_INVALID_TOKEN: 'AUTH_INVALID_TOKEN',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_INSUFFICIENT_PERMISSIONS: 'AUTH_INSUFFICIENT_PERMISSIONS',
  AUTH_USER_NOT_FOUND: 'AUTH_USER_NOT_FOUND',

  // Session errors
  SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',
  SESSION_ALREADY_STARTED: 'SESSION_ALREADY_STARTED',
  SESSION_ALREADY_ENDED: 'SESSION_ALREADY_ENDED',
  SESSION_TIME_LIMIT_EXCEEDED: 'SESSION_TIME_LIMIT_EXCEEDED',
  SESSION_INVALID_STATUS: 'SESSION_INVALID_STATUS',

  // Coach errors
  COACH_NOT_FOUND: 'COACH_NOT_FOUND',
  COACH_NOT_AVAILABLE: 'COACH_NOT_AVAILABLE',
  COACH_ALREADY_EXISTS: 'COACH_ALREADY_EXISTS',

  // Subscription errors
  SUBSCRIPTION_REQUIRED: 'SUBSCRIPTION_REQUIRED',
  SUBSCRIPTION_LIMIT_EXCEEDED: 'SUBSCRIPTION_LIMIT_EXCEEDED',
  SUBSCRIPTION_INVALID: 'SUBSCRIPTION_INVALID',

  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',

  // System errors
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  NETWORK_ERROR: 'NETWORK_ERROR',
} as const;

// Date and time formats
export const DATE_FORMATS = {
  DISPLAY_DATE: 'MMM dd, yyyy',
  DISPLAY_TIME: 'hh:mm a',
  DISPLAY_DATETIME: 'MMM dd, yyyy hh:mm a',
  API_DATE: 'yyyy-MM-dd',
  API_TIME: 'HH:mm:ss',
  API_DATETIME: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
} as const;

// Cache TTL in milliseconds
export const CACHE_TTL = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 60 * 60 * 1000, // 60 minutes
  SESSION: 24 * 60 * 60 * 1000, // 24 hours
} as const;

// Rate limiting
export const RATE_LIMITS = {
  API_CALLS: {
    MAX_REQUESTS: 100,
    TIME_WINDOW: 15 * 60 * 1000, // 15 minutes
  },
  SEARCH_REQUESTS: {
    MAX_REQUESTS: 30,
    TIME_WINDOW: 60 * 1000, // 1 minute
  },
  SESSION_CREATION: {
    MAX_REQUESTS: 10,
    TIME_WINDOW: 60 * 60 * 1000, // 1 hour
  },
} as const;

// Application URLs
export const URLS = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  COACH_SEARCH: '/coaches',
  COACH_PROFILE: '/coaches/:id',
  SESSION_DETAILS: '/sessions/:id',
  SETTINGS: '/settings',
  SUBSCRIPTION: '/subscription',
} as const;

// Export type for TypeScript
export type SessionState = typeof SESSION.STATES[keyof typeof SESSION.STATES];
export type Country = typeof COUNTRIES[number];
export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS;
export type UserRole = typeof ROLES[keyof typeof ROLES];
export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

/**
 * Example usage:
 * 
 * import { SESSION, SUBSCRIPTION_PLANS, ROLES } from '@/utils/constants';
 * 
 * if (session.status === SESSION.STATES.IN_PROGRESS) {
 *   // Handle active session
 * }
 * 
 * const basicPlan = SUBSCRIPTION_PLANS.BASIC;
 * const userRole = ROLES.BASIC_USER;
 */

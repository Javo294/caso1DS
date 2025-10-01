import { Middleware } from '@reduxjs/toolkit';
import { logger } from '@/utils/logger';
import { AuthException } from '@/exceptions/AuthException';

export const authMiddleware: Middleware = store => next => action => {
  // Log authentication-related actions
  if (action.type?.includes('auth/')) {
    logger.debug('Auth action dispatched', { 
      type: action.type, 
      payload: action.payload 
    });
  }

  // Check authentication for protected actions
  if (action.meta?.requiresAuth) {
    const state = store.getState();
    const isAuthenticated = state.auth.isAuthenticated;
    
    if (!isAuthenticated) {
      logger.warn('Unauthorized action attempted', { 
        action: action.type,
        userId: state.auth.user?.id 
      });
      
      throw new AuthException('Authentication required for this action', {
        action: action.type
      });
    }
  }

  // Check role-based permissions
  if (action.meta?.requiredRole) {
    const state = store.getState();
    const userRole = state.auth.user?.role;
    const requiredRole = action.meta.requiredRole;

    if (userRole !== requiredRole && userRole !== 'admin') {
      logger.warn('Insufficient permissions for action', {
        action: action.type,
        userRole,
        requiredRole
      });

      throw new AuthException('Insufficient permissions', {
        action: action.type,
        userRole,
        requiredRole
      });
    }
  }

  return next(action);
};

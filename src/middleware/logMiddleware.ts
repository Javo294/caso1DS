import { Middleware } from '@reduxjs/toolkit';
import { logger } from '@/utils/logger';

export const logMiddleware: Middleware = store => next => action => {
  const result = next(action);
  
  // Log state changes for important actions
  if (action.type?.includes('/fulfilled') || action.type?.includes('/rejected')) {
    logger.debug('Redux action completed', {
      type: action.type,
      state: store.getState()
    });
  }

  return result;
};

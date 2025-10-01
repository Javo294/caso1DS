import { Middleware } from '@reduxjs/toolkit';
import { logger } from '@/utils/logger';
import { BaseException } from '@/exceptions/BaseException';

export const errorMiddleware: Middleware = store => next => action => {
  try {
    return next(action);
  } catch (error) {
    // Log the error
    logger.error('Redux action error', error as Error, {
      action: action.type,
      state: store.getState()
    });

    // Convert to BaseException if not already
    const appError = error instanceof BaseException 
      ? error 
      : new BaseException(
          error.message || 'Unknown error occurred',
          'REDUX_ACTION_ERROR',
          { originalError: error, action: action.type }
        );

    // Dispatch error action
    store.dispatch({
      type: 'error/actionError',
      payload: appError.toJSON(),
      meta: { originalAction: action }
    });

    // Re-throw for components to handle
    throw appError;
  }
};

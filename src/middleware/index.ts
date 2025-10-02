import { configureStore } from '@reduxjs/toolkit';
import { authMiddleware, errorMiddleware, logMiddleware } from '@/middleware';

export const store = configureStore({
  reducer: {
    // your reducers
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(authMiddleware, errorMiddleware, logMiddleware),
});

// Usage example in actions:
/*
export const fetchCoachProfile = (coachId: string) => ({
  type: 'coaches/fetchProfile',
  payload: coachId,
  meta: {
    requiresAuth: true,
    requiredRole: 'user' // or 'premiumUser'
  }
});
*/

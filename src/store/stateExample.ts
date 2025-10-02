/**
 * Example state management usage for developers
 * This file demonstrates how to use the Zustand stores in components
 */

import { useCoachStore } from './useCoachStore';
import { useSessionStore } from './useSessionStore';
import { useAuthStore } from './useAuthStore';

/**
 * Example 1: Coach search component
 */
export const CoachSearchExample = () => {
  // Get state and actions from coach store
  const {
    searchResults,
    loading,
    error,
    searchQuery,
    filters,
    searchCoaches,
    setSearchQuery,
    setFilters,
    clearSearchResults
  } = useCoachStore();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchCoaches(query, filters);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    // Trigger new search with updated filters
    searchCoaches(searchQuery, newFilters);
  };

  return {
    searchResults,
    loading,
    error,
    searchQuery,
    filters,
    handleSearch,
    handleFilterChange,
    clearSearchResults
  };
};

/**
 * Example 2: Session management component
 */
export const SessionManagementExample = () => {
  const {
    userSessions,
    currentSession,
    loading,
    error,
    fetchUserSessions,
    createSession,
    startSession,
    endSession,
    rateSession
  } = useSessionStore();

  const { user } = useAuthStore();

  const loadUserSessions = () => {
    if (user) {
      fetchUserSessions(user.id, { page: 1, limit: 10 });
    }
  };

  const handleCreateSession = async (coachId: string, topic: string, description: string) => {
    if (user) {
      try {
        await createSession({
          userId: user.id,
          coachId,
          topic,
          description
        });
        // Session created successfully
      } catch (error) {
        // Handle error
      }
    }
  };

  const handleStartSession = (sessionId: string) => {
    startSession(sessionId);
  };

  const handleEndSession = (sessionId: string) => {
    endSession(sessionId);
  };

  const handleRateSession = (sessionId: string, rating: number, feedback?: string) => {
    rateSession(sessionId, rating, feedback);
  };

  return {
    userSessions,
    currentSession,
    loading,
    error,
    loadUserSessions,
    handleCreateSession,
    handleStartSession,
    handleEndSession,
    handleRateSession
  };
};

/**
 * Example 3: Combined store usage
 */
export const CombinedStoreExample = () => {
  const { user } = useAuthStore();
  const { coaches, searchCoaches } = useCoachStore();
  const { createSession } = useSessionStore();

  const handleBookSession = async (coachId: string, topic: string, description: string) => {
    if (!user) {
      throw new Error('User must be logged in');
    }

    // First, search for the coach to verify availability
    await searchCoaches('', { availableNow: true });
    const coach = coaches.find(c => c.id === coachId);

    if (!coach) {
      throw new Error('Coach not found');
    }

    if (!coach.available) {
      throw new Error('Coach is not available');
    }

    // Create the session
    const session = await createSession({
      userId: user.id,
      coachId,
      topic,
      description
    });

    return session;
  };

  return {
    handleBookSession
  };
};

/**
 * Example 4: Real-time session updates
 */
export const RealTimeSessionExample = () => {
  const { currentSession, setCurrentSession } = useSessionStore();

  // This would be connected to a WebSocket or similar real-time service
  const handleRealTimeUpdate = (sessionData: any) => {
    // Update the current session with real-time data
    setCurrentSession(sessionData);
  };

  return {
    currentSession,
    handleRealTimeUpdate
  };
};

/**
 * Best practices for state management:
 * 
 * 1. Use the store hooks in components only, not in services or other non-UI layers.
 * 2. For complex state derivations, use selectors to avoid unnecessary re-renders.
 * 3. Keep the store focused on global state; use local state for component-specific state.
 * 4. Use the devtools middleware for debugging in development.
 * 5. Always handle loading and error states in the store.
 * 6. Use the reset action to clear state when needed (e.g., on logout).
 */

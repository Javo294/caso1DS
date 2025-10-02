import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { SessionDTO } from '@/dto/SessionDTO';
import { sessionService } from '@/services/SessionService';
import { logger } from '@/utils/logger';

interface SessionState {
  // State
  sessions: SessionDTO[];
  currentSession: SessionDTO | null;
  userSessions: SessionDTO[];
  coachSessions: SessionDTO[];
  loading: boolean;
  error: string | null;

  // Actions
  setCurrentSession: (session: SessionDTO | null) => void;
  clearError: () => void;
  reset: () => void;

  // Async Actions
  createSession: (request: {
    userId: string;
    coachId: string;
    topic: string;
    description: string;
    preferredTime?: Date;
  }) => Promise<SessionDTO>;
  fetchSession: (sessionId: string) => Promise<void>;
  fetchUserSessions: (userId: string, options?: { page?: number; limit?: number; status?: string }) => Promise<void>;
  fetchCoachSessions: (coachId: string, options?: { page?: number; limit?: number; status?: string }) => Promise<void>;
  updateSessionStatus: (sessionId: string, status: 'accepted' | 'rejected' | 'cancelled' | 'completed', notes?: string) => Promise<void>;
  startSession: (sessionId: string) => Promise<void>;
  endSession: (sessionId: string) => Promise<void>;
  rateSession: (sessionId: string, rating: number, feedback?: string) => Promise<void>;
}

const initialState = {
  sessions: [],
  currentSession: null,
  userSessions: [],
  coachSessions: [],
  loading: false,
  error: null,
};

export const useSessionStore = create<SessionState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setCurrentSession: (session: SessionDTO | null) => {
        set({ currentSession: session });
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set(initialState);
      },

      createSession: async (request) => {
        set({ loading: true, error: null });
        try {
          const session = await sessionService.createSession(request);
          set((state) => ({
            sessions: [...state.sessions, session],
            userSessions: [...state.userSessions, session],
            loading: false,
          }));
          logger.info('Session created', { sessionId: session.id });
          return session;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create session';
          set({ error: errorMessage, loading: false });
          logger.error('Failed to create session', error as Error, { request });
          throw error;
        }
      },

      fetchSession: async (sessionId: string) => {
        set({ loading: true, error: null });
        try {
          const session = await sessionService.getSession(sessionId);
          set({ currentSession: session, loading: false });
          logger.info('Session fetched', { sessionId });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch session';
          set({ error: errorMessage, loading: false });
          logger.error('Failed to fetch session', error as Error, { sessionId });
        }
      },

      fetchUserSessions: async (userId: string, options = {}) => {
        set({ loading: true, error: null });
        try {
          const { sessions } = await sessionService.getUserSessions(userId, options);
          set({ userSessions: sessions, loading: false });
          logger.info('User sessions fetched', { userId, count: sessions.length });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user sessions';
          set({ error: errorMessage, loading: false });
          logger.error('Failed to fetch user sessions', error as Error, { userId, options });
        }
      },

      fetchCoachSessions: async (coachId: string, options = {}) => {
        set({ loading: true, error: null });
        try {
          const { sessions } = await sessionService.getCoachSessions(coachId, options);
          set({ coachSessions: sessions, loading: false });
          logger.info('Coach sessions fetched', { coachId, count: sessions.length });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch coach sessions';
          set({ error: errorMessage, loading: false });
          logger.error('Failed to fetch coach sessions', error as Error, { coachId, options });
        }
      },

      updateSessionStatus: async (sessionId: string, status: 'accepted' | 'rejected' | 'cancelled' | 'completed', notes?: string) => {
        set({ loading: true, error: null });
        try {
          const session = await sessionService.updateSessionStatus(sessionId, status, notes);
          // Update the session in all relevant state arrays
          set((state) => {
            const updateSessions = (sessions: SessionDTO[]) =>
              sessions.map(s => s.id === sessionId ? session : s);
            return {
              sessions: updateSessions(state.sessions),
              userSessions: updateSessions(state.userSessions),
              coachSessions: updateSessions(state.coachSessions),
              currentSession: state.currentSession?.id === sessionId ? session : state.currentSession,
              loading: false,
            };
          });
          logger.info('Session status updated', { sessionId, status });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update session status';
          set({ error: errorMessage, loading: false });
          logger.error('Failed to update session status', error as Error, { sessionId, status });
        }
      },

      startSession: async (sessionId: string) => {
        set({ loading: true, error: null });
        try {
          const session = await sessionService.startSession(sessionId);
          set((state) => ({
            currentSession: session,
            sessions: state.sessions.map(s => s.id === sessionId ? session : s),
            userSessions: state.userSessions.map(s => s.id === sessionId ? session : s),
            coachSessions: state.coachSessions.map(s => s.id === sessionId ? session : s),
            loading: false,
          }));
          logger.info('Session started', { sessionId });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to start session';
          set({ error: errorMessage, loading: false });
          logger.error('Failed to start session', error as Error, { sessionId });
        }
      },

      endSession: async (sessionId: string) => {
        set({ loading: true, error: null });
        try {
          const session = await sessionService.endSession(sessionId);
          set((state) => ({
            currentSession: session,
            sessions: state.sessions.map(s => s.id === sessionId ? session : s),
            userSessions: state.userSessions.map(s => s.id === sessionId ? session : s),
            coachSessions: state.coachSessions.map(s => s.id === sessionId ? session : s),
            loading: false,
          }));
          logger.info('Session ended', { sessionId });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to end session';
          set({ error: errorMessage, loading: false });
          logger.error('Failed to end session', error as Error, { sessionId });
        }
      },

      rateSession: async (sessionId: string, rating: number, feedback?: string) => {
        set({ loading: true, error: null });
        try {
          const session = await sessionService.rateSession(sessionId, rating, feedback);
          set((state) => ({
            currentSession: session,
            sessions: state.sessions.map(s => s.id === sessionId ? session : s),
            userSessions: state.userSessions.map(s => s.id === sessionId ? session : s),
            coachSessions: state.coachSessions.map(s => s.id === sessionId ? session : s),
            loading: false,
          }));
          logger.info('Session rated', { sessionId, rating });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to rate session';
          set({ error: errorMessage, loading: false });
          logger.error('Failed to rate session', error as Error, { sessionId, rating });
        }
      },
    }),
    {
      name: 'session-store',
    }
  )
);

/**
 * Example usage in components:
 * 
 * import { useSessionStore } from '@/store/useSessionStore';
 * 
 * const SessionComponent = () => {
 *   const { currentSession, loading, error, startSession } = useSessionStore();
 * 
 *   const handleStartSession = () => {
 *     if (currentSession) {
 *       startSession(currentSession.id);
 *     }
 *   };
 * 
 *   return (
 *     <div>
 *       {currentSession && (
 *         <SessionInfo session={currentSession} />
 *       )}
 *       <button onClick={handleStartSession} disabled={loading}>
 *         Start Session
 *       </button>
 *       {error && <ErrorMessage message={error} />}
 *     </div>
 *   );
 * };
 */

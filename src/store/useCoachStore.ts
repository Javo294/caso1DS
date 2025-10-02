import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { CoachDTO } from '@/dto/CoachDTO';
import { coachService } from '@/services/CoachService';
import { logger } from '@/utils/logger';

interface CoachState {
  // State
  coaches: CoachDTO[];
  currentCoach: CoachDTO | null;
  searchResults: CoachDTO[];
  filters: {
    specialty: string;
    minRating: number;
    maxPrice: number;
    availableNow: boolean;
  };
  loading: boolean;
  error: string | null;
  searchQuery: string;

  // Actions
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<CoachState['filters']>) => void;
  clearSearchResults: () => void;
  clearError: () => void;
  reset: () => void;

  // Async Actions
  searchCoaches: (query: string, filters?: Partial<CoachState['filters']>) => Promise<void>;
  fetchCoachProfile: (coachId: string) => Promise<void>;
  updateCoachAvailability: (coachId: string, available: boolean) => Promise<void>;
}

const initialState = {
  coaches: [],
  currentCoach: null,
  searchResults: [],
  filters: {
    specialty: '',
    minRating: 0,
    maxPrice: 1000,
    availableNow: false,
  },
  loading: false,
  error: null,
  searchQuery: '',
};

export const useCoachStore = create<CoachState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      setFilters: (filters: Partial<CoachState['filters']>) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }));
      },

      clearSearchResults: () => {
        set({ searchResults: [], searchQuery: '' });
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set(initialState);
      },

      searchCoaches: async (query: string, filters?: Partial<CoachState['filters']>) => {
        set({ loading: true, error: null });
        try {
          const currentFilters = get().filters;
          const searchFilters = { ...currentFilters, ...filters };
          const results = await coachService.searchCoaches(query, searchFilters);
          set({ searchResults: results, loading: false });
          logger.info('Coach search completed', { query, resultCount: results.length });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Search failed';
          set({ error: errorMessage, loading: false });
          logger.error('Coach search failed', error as Error, { query, filters });
        }
      },

      fetchCoachProfile: async (coachId: string) => {
        set({ loading: true, error: null });
        try {
          const coach = await coachService.getCoachProfile(coachId);
          set({ currentCoach: coach, loading: false });
          logger.info('Coach profile fetched', { coachId });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch coach profile';
          set({ error: errorMessage, loading: false });
          logger.error('Failed to fetch coach profile', error as Error, { coachId });
        }
      },

      updateCoachAvailability: async (coachId: string, available: boolean) => {
        set({ loading: true, error: null });
        try {
          await coachService.updateCoachAvailability(coachId, available);
          // Update the current coach if it's the one being updated
          set((state) => {
            if (state.currentCoach?.id === coachId) {
              return { 
                currentCoach: { ...state.currentCoach, available },
                loading: false 
              };
            }
            return { loading: false };
          });
          logger.info('Coach availability updated', { coachId, available });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update availability';
          set({ error: errorMessage, loading: false });
          logger.error('Failed to update coach availability', error as Error, { coachId, available });
        }
      },
    }),
    {
      name: 'coach-store',
    }
  )
);

/**
 * Example usage in components:
 * 
 * import { useCoachStore } from '@/store/useCoachStore';
 * 
 * const CoachSearch = () => {
 *   const { searchResults, loading, error, searchCoaches } = useCoachStore();
 * 
 *   const handleSearch = (query: string) => {
 *     searchCoaches(query);
 *   };
 * 
 *   return (
 *     <div>
 *       <SearchInput onSearch={handleSearch} />
 *       {loading && <Spinner />}
 *       {error && <ErrorMessage message={error} />}
 *       <CoachList coaches={searchResults} />
 *     </div>
 *   );
 * };
 */

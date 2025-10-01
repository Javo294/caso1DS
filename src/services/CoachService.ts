// src/services/CoachService.ts
import { logger } from '@/utils/logger';
import { apiClient } from '@/api/apiClient';
import { CoachDTO } from '@/dto/CoachDTO';
import { CoachValidator } from '@/validators/CoachValidator';

export interface SearchFilters {
  specialty?: string;
  minRating?: number;
  availability?: boolean;
  priceRange?: { min: number; max: number };
}

export class CoachService {
  private validator: CoachValidator;

  constructor(validator: CoachValidator = new CoachValidator()) {
    this.validator = validator;
  }

  public async searchCoaches(query: string, filters: SearchFilters = {}): Promise<CoachDTO[]> {
    try {
      logger.info('Searching coaches', { query, filters });
      
      const response = await apiClient.get('/coaches/search', {
        params: { query, ...filters }
      });

      const coaches = response.data.map((coachData: any) => 
        CoachDTO.fromApiResponse(coachData)
      );

      // Validate each coach
      coaches.forEach(coach => {
        this.validator.validate(coach);
      });

      logger.debug('Coach search completed', { count: coaches.length });
      return coaches;

    } catch (error) {
      logger.error('Coach search failed', error as Error, { query, filters });
      throw error;
    }
  }

  public async getCoachProfile(coachId: string): Promise<CoachDTO> {
    try {
      logger.info('Fetching coach profile', { coachId });
      
      const response = await apiClient.get(`/coaches/${coachId}`);
      const coach = CoachDTO.fromApiResponse(response.data);
      
      this.validator.validate(coach);
      
      logger.debug('Coach profile fetched successfully');
      return coach;

    } catch (error) {
      logger.error('Failed to fetch coach profile', error as Error, { coachId });
      throw error;
    }
  }

  public async updateCoachAvailability(
    coachId: string, 
    availability: boolean
  ): Promise<void> {
    try {
      logger.info('Updating coach availability', { coachId, availability });
      
      await apiClient.patch(`/coaches/${coachId}/availability`, {
        available: availability
      });

      logger.debug('Coach availability updated successfully');

    } catch (error) {
      logger.error('Failed to update coach availability', error as Error, { 
        coachId, 
        availability 
      });
      throw error;
    }
  }
}

// Dependency Injection setup
export const coachService = new CoachService(new CoachValidator());

// Usage example for developers:
/*
import { coachService } from '@/services/CoachService';
import { useAppDispatch } from '@/store/hooks';
import { setCoaches, setLoading } from '@/store/slices/coachSlice';

export const useCoachSearch = () => {
  const dispatch = useAppDispatch();

  const searchCoaches = async (query: string, filters: SearchFilters) => {
    try {
      dispatch(setLoading(true));
      
      const coaches = await coachService.searchCoaches(query, filters);
      dispatch(setCoaches(coaches));
      
      return coaches;
    } catch (error) {
      // Error handling through Redux
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { searchCoaches };
};
*/

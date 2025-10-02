import { CoachDTO, CoachApiResponse } from '@/dto/CoachDTO';
import { SessionDTO, SessionApiResponse } from '@/dto/SessionDTO';
import { logger } from '@/utils/logger';

export class ApiToModelTransformer {
  public static transformCoach(apiData: CoachApiResponse): CoachDTO {
    try {
      return CoachDTO.fromApiResponse(apiData);
    } catch (error) {
      logger.error('Failed to transform coach API data', error as Error, { apiData });
      throw new BaseException('Invalid coach data format', 'TRANSFORMATION_ERROR', { apiData });
    }
  }

  public static transformSession(apiData: SessionApiResponse): SessionDTO {
    try {
      return SessionDTO.fromApiResponse(apiData);
    } catch (error) {
      logger.error('Failed to transform session API data', error as Error, { apiData });
      throw new BaseException('Invalid session data format', 'TRANSFORMATION_ERROR', { apiData });
    }
  }

  public static transformCoachList(apiData: CoachApiResponse[]): CoachDTO[] {
    return apiData.map(item => this.transformCoach(item));
  }

  public static transformSessionList(apiData: SessionApiResponse[]): SessionDTO[] {
    return apiData.map(item => this.transformSession(item));
  }
}

// Usage in services:
/*
import { ApiToModelTransformer } from '@/dto/transformers/ApiToModelTransformer';

export class CoachService {
  public async getCoachProfile(coachId: string): Promise<CoachDTO> {
    const response = await apiClient.get(`/coaches/${coachId}`);
    return ApiToModelTransformer.transformCoach(response.data);
  }

  public async searchCoaches(query: string): Promise<CoachDTO[]> {
    const response = await apiClient.get('/coaches/search', { params: { query } });
    return ApiToModelTransformer.transformCoachList(response.data);
  }
}
*/

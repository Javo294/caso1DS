import { ServiceTemplate } from './ServiceTemplate';
import { SessionDTO, SessionApiResponse } from '@/dto/SessionDTO';
import { SessionValidator } from '@/validators/SessionValidator';
import { logger } from '@/utils/logger';
import { AuthException } from '@/exceptions/AuthException';

export interface CreateSessionRequest {
  userId: string;
  coachId: string;
  topic: string;
  description: string;
  preferredTime?: Date;
}

export interface UpdateSessionRequest {
  sessionId: string;
  status?: string;
  startTime?: Date;
  endTime?: Date;
  rating?: number;
  feedback?: string;
}

/**
 * Service for managing coaching sessions
 */
export class SessionService extends ServiceTemplate {
  private validator: SessionValidator;

  constructor(validator: SessionValidator = new SessionValidator()) {
    super('SessionService');
    this.validator = validator;
  }

  /**
   * Create a new coaching session
   */
  public async createSession(request: CreateSessionRequest): Promise<SessionDTO> {
    return this.executeServiceOperation(
      'createSession',
      async () => {
        await this.validatePermissions('user', ['session:create']);

        // Validate input
        this.validateSessionRequest(request);

        // Check user's available sessions based on subscription
        const availableSessions = await this.getUserAvailableSessions(request.userId);
        if (availableSessions <= 0) {
          throw new AuthException('No available sessions in your plan', {
            userId: request.userId,
            operation: 'createSession'
          });
        }

        // Create session via API
        const apiClient = this.getDependency('apiClient');
        const response = await apiClient.post('/sessions', {
          user_id: request.userId,
          coach_id: request.coachId,
          topic: request.topic,
          description: request.description,
          preferred_time: request.preferredTime?.toISOString(),
          status: 'requested'
        });

        const session = SessionDTO.fromApiResponse(response.data);
        
        // Validate the created session
        this.validator.validate(session);

        logger.info('Session created successfully', {
          sessionId: session.id,
          userId: request.userId,
          coachId: request.coachId
        });

        return session;
      },
      {
        requiresAuth: true,
        requiredRole: 'user',
        logLevel: 'info'
      }
    );
  }

  /**
   * Get session by ID
   */
  public async getSession(sessionId: string): Promise<SessionDTO> {
    return this.executeServiceOperation(
      'getSession',
      async () => {
        await this.validatePermissions('user', ['session:read']);

        const apiClient = this.getDependency('apiClient');
        const response = await apiClient.get(`/sessions/${sessionId}`);

        const session = SessionDTO.fromApiResponse(response.data);
        this.validator.validate(session);

        // Check if user has access to this session
        await this.validateSessionAccess(session);

        return session;
      },
      {
        requiresAuth: true,
        logLevel: 'debug'
      }
    );
  }

  /**
   * Update session status
   */
  public async updateSessionStatus(
    sessionId: string, 
    status: 'accepted' | 'rejected' | 'cancelled' | 'completed',
    notes?: string
  ): Promise<SessionDTO> {
    return this.executeServiceOperation(
      'updateSessionStatus',
      async () => {
        await this.validatePermissions('coach', ['session:update']);

        const apiClient = this.getDependency('apiClient');
        const response = await apiClient.patch(`/sessions/${sessionId}/status`, {
          status,
          notes,
          updated_at: new Date().toISOString()
        });

        const session = SessionDTO.fromApiResponse(response.data);
        this.validator.validate(session);

        logger.info('Session status updated', {
          sessionId,
          newStatus: status,
          notes
        });

        return session;
      },
      {
        requiresAuth: true,
        requiredRole: 'coach',
        logLevel: 'info'
      }
    );
  }

  /**
   * Start a session (begin the 20-minute countdown)
   */
  public async startSession(sessionId: string): Promise<SessionDTO> {
    return this.executeServiceOperation(
      'startSession',
      async () => {
        await this.validatePermissions('coach', ['session:start']);

        const session = await this.getSession(sessionId);

        // Validate that session can be started
        if (session.status !== 'accepted') {
          throw new Error('Session must be accepted before starting');
        }

        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + 20 * 60 * 1000); // 20 minutes

        const apiClient = this.getDependency('apiClient');
        const response = await apiClient.patch(`/sessions/${sessionId}`, {
          status: 'in_progress',
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString()
        });

        const updatedSession = SessionDTO.fromApiResponse(response.data);
        this.validator.validate(updatedSession);

        logger.info('Session started', {
          sessionId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString()
        });

        return updatedSession;
      },
      {
        requiresAuth: true,
        requiredRole: 'coach',
        logLevel: 'info'
      }
    );
  }

  /**
   * End a session
   */
  public async endSession(sessionId: string): Promise<SessionDTO> {
    return this.executeServiceOperation(
      'endSession',
      async () => {
        await this.validatePermissions('coach', ['session:end']);

        const endTime = new Date();

        const apiClient = this.getDependency('apiClient');
        const response = await apiClient.patch(`/sessions/${sessionId}`, {
          status: 'completed',
          end_time: endTime.toISOString()
        });

        const session = SessionDTO.fromApiResponse(response.data);
        this.validator.validate(session);

        logger.info('Session ended', {
          sessionId,
          endTime: endTime.toISOString()
        });

        return session;
      },
      {
        requiresAuth: true,
        requiredRole: 'coach',
        logLevel: 'info'
      }
    );
  }

  /**
   * Rate a completed session
   */
  public async rateSession(
    sessionId: string, 
    rating: number, 
    feedback?: string
  ): Promise<SessionDTO> {
    return this.executeServiceOperation(
      'rateSession',
      async () => {
        await this.validatePermissions('user', ['session:rate']);

        // Validate rating range
        if (rating < 1 || rating > 5) {
          throw new Error('Rating must be between 1 and 5');
        }

        const session = await this.getSession(sessionId);

        // Validate that session is completed
        if (session.status !== 'completed') {
          throw new Error('Can only rate completed sessions');
        }

        // Validate that user is the session participant
        const currentUser = this.getCurrentUser();
        if (session.userId !== currentUser.id) {
          throw new PermissionException('Can only rate your own sessions');
        }

        const apiClient = this.getDependency('apiClient');
        const response = await apiClient.post(`/sessions/${sessionId}/rating`, {
          rating,
          feedback,
          rated_at: new Date().toISOString()
        });

        const updatedSession = SessionDTO.fromApiResponse(response.data);
        this.validator.validate(updatedSession);

        logger.info('Session rated', {
          sessionId,
          rating,
          hasFeedback: !!feedback
        });

        return updatedSession;
      },
      {
        requiresAuth: true,
        requiredRole: 'user',
        logLevel: 'info'
      }
    );
  }

  /**
   * Get user's sessions with pagination
   */
  public async getUserSessions(
    userId: string, 
    options: { page?: number; limit?: number; status?: string } = {}
  ): Promise<{ sessions: SessionDTO[]; total: number; page: number }> {
    return this.executeServiceOperation(
      'getUserSessions',
      async () => {
        await this.validatePermissions('user', ['session:read']);

        const { page = 1, limit = 10, status } = options;
        const apiClient = this.getDependency('apiClient');

        const params = new URLSearchParams({
          user_id: userId,
          page: page.toString(),
          limit: limit.toString()
        });

        if (status) {
          params.append('status', status);
        }

        const response = await apiClient.get(`/sessions?${params.toString()}`);

        const sessions = response.data.sessions.map((sessionData: SessionApiResponse) => {
          const session = SessionDTO.fromApiResponse(sessionData);
          this.validator.validate(session);
          return session;
        });

        return {
          sessions,
          total: response.data.total,
          page: response.data.page
        };
      },
      {
        requiresAuth: true,
        logLevel: 'debug'
      }
    );
  }

  /**
   * Get coach's sessions with pagination
   */
  public async getCoachSessions(
    coachId: string,
    options: { page?: number; limit?: number; status?: string } = {}
  ): Promise<{ sessions: SessionDTO[]; total: number; page: number }> {
    return this.executeServiceOperation(
      'getCoachSessions',
      async () => {
        await this.validatePermissions('coach', ['session:read']);

        const { page = 1, limit = 10, status } = options;
        const apiClient = this.getDependency('apiClient');

        const params = new URLSearchParams({
          coach_id: coachId,
          page: page.toString(),
          limit: limit.toString()
        });

        if (status) {
          params.append('status', status);
        }

        const response = await apiClient.get(`/sessions?${params.toString()}`);

        const sessions = response.data.sessions.map((sessionData: SessionApiResponse) => {
          const session = SessionDTO.fromApiResponse(sessionData);
          this.validator.validate(session);
          return session;
        });

        return {
          sessions,
          total: response.data.total,
          page: response.data.page
        };
      },
      {
        requiresAuth: true,
        requiredRole: 'coach',
        logLevel: 'debug'
      }
    );
  }

  /**
   * Validate session creation request
   */
  private validateSessionRequest(request: CreateSessionRequest): void {
    if (!request.userId || !request.coachId || !request.topic) {
      throw new Error('Missing required fields: userId, coachId, topic');
    }

    if (request.topic.length < 5) {
      throw new Error('Topic must be at least 5 characters long');
    }

    if (request.description && request.description.length > 500) {
      throw new Error('Description cannot exceed 500 characters');
    }
  }

  /**
   * Validate that user has access to the session
   */
  private async validateSessionAccess(session: SessionDTO): Promise<void> {
    const currentUser = this.getCurrentUser();
    
    if (session.userId !== currentUser.id && session.coachId !== currentUser.id && currentUser.role !== 'admin') {
      throw new PermissionException('Access denied to this session', {
        sessionId: session.id,
        userId: currentUser.id,
        sessionUserId: session.userId,
        sessionCoachId: session.coachId
      });
    }
  }

  /**
   * Get user's available sessions based on subscription
   */
  private async getUserAvailableSessions(userId: string): Promise<number> {
    // This would typically call a subscription service
    // For now, we'll return a mock value
    const apiClient = this.getDependency('apiClient');
    const response = await apiClient.get(`/users/${userId}/subscription`);
    
    return response.data.availableSessions || 0;
  }
}

// Export a singleton instance
export const sessionService = new SessionService();

/**
 * Example usage for developers:
 * 
 * // Register dependencies
 * sessionService.registerDependency('apiClient', apiClientInstance);
 * 
 * // Create a session
 * const session = await sessionService.createSession({
 *   userId: 'user123',
 *   coachId: 'coach456',
 *   topic: 'Car engine noise diagnosis',
 *   description: 'My car is making a strange noise from the engine...'
 * });
 * 
 * // Rate a session
 * await sessionService.rateSession(session.id, 5, 'Great advice!');
 */

import { logger } from '@/utils/logger';
import { BaseException } from '@/exceptions/BaseException';

/**
 * API Response interface for Session
 */
export interface SessionApiResponse {
  id: string;
  user_id: string;
  coach_id: string;
  topic: string;
  description?: string;
  status: 'requested' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  start_time?: string;
  end_time?: string;
  rating?: number;
  feedback?: string;
  created_at: string;
  updated_at: string;
  user_notes?: string;
  coach_notes?: string;
  cancellation_reason?: string;
  scheduled_time?: string;
}

/**
 * API Request interface for Session creation
 */
export interface SessionApiRequest {
  user_id: string;
  coach_id: string;
  topic: string;
  description?: string;
  scheduled_time?: string;
  status?: 'requested';
}

/**
 * API Request interface for Session update
 */
export interface SessionUpdateApiRequest {
  topic?: string;
  description?: string;
  status?: string;
  start_time?: string;
  end_time?: string;
  rating?: number;
  feedback?: string;
  user_notes?: string;
  coach_notes?: string;
  cancellation_reason?: string;
}

/**
 * Session Data Transfer Object
 * Handles transformation between API and frontend models
 */
export class SessionDTO {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly coachId: string,
    public readonly topic: string,
    public readonly description?: string,
    public readonly status: 'requested' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' = 'requested',
    public readonly startTime?: Date,
    public readonly endTime?: Date,
    public readonly rating?: number,
    public readonly feedback?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly userNotes?: string,
    public readonly coachNotes?: string,
    public readonly cancellationReason?: string,
    public readonly scheduledTime?: Date
  ) {}

  /**
   * Transform from API response to DTO
   */
  public static fromApiResponse(apiData: SessionApiResponse): SessionDTO {
    try {
      logger.debug('Transforming session API response to DTO', { 
        sessionId: apiData.id 
      });

      return new SessionDTO(
        apiData.id,
        apiData.user_id,
        apiData.coach_id,
        apiData.topic,
        apiData.description,
        apiData.status,
        apiData.start_time ? new Date(apiData.start_time) : undefined,
        apiData.end_time ? new Date(apiData.end_time) : undefined,
        apiData.rating,
        apiData.feedback,
        new Date(apiData.created_at),
        new Date(apiData.updated_at),
        apiData.user_notes,
        apiData.coach_notes,
        apiData.cancellation_reason,
        apiData.scheduled_time ? new Date(apiData.scheduled_time) : undefined
      );
    } catch (error) {
      logger.error('Failed to transform session API response', error as Error, { apiData });
      throw new BaseException(
        'Invalid session data format',
        'TRANSFORMATION_ERROR',
        { apiData }
      );
    }
  }

  /**
   * Transform from DTO to API request for session creation
   */
  public toApiRequest(): SessionApiRequest {
    logger.debug('Transforming session DTO to API request', { 
      sessionId: this.id 
    });

    return {
      user_id: this.userId,
      coach_id: this.coachId,
      topic: this.topic,
      description: this.description,
      scheduled_time: this.scheduledTime?.toISOString(),
      status: 'requested'
    };
  }

  /**
   * Transform from DTO to API request for session update
   */
  public toUpdateApiRequest(): SessionUpdateApiRequest {
    logger.debug('Transforming session DTO to update API request', { 
      sessionId: this.id 
    });

    return {
      topic: this.topic,
      description: this.description,
      status: this.status,
      start_time: this.startTime?.toISOString(),
      end_time: this.endTime?.toISOString(),
      rating: this.rating,
      feedback: this.feedback,
      user_notes: this.userNotes,
      coach_notes: this.coachNotes,
      cancellation_reason: this.cancellationReason
    };
  }

  /**
   * Transform from form data to DTO
   */
  public static fromFormData(formData: any): SessionDTO {
    logger.debug('Transforming form data to session DTO', { 
      formData 
    });

    return new SessionDTO(
      formData.id || '',
      formData.userId,
      formData.coachId,
      formData.topic,
      formData.description,
      formData.status || 'requested',
      formData.startTime ? new Date(formData.startTime) : undefined,
      formData.endTime ? new Date(formData.endTime) : undefined,
      formData.rating ? parseFloat(formData.rating) : undefined,
      formData.feedback,
      formData.createdAt ? new Date(formData.createdAt) : new Date(),
      formData.updatedAt ? new Date(formData.updatedAt) : new Date(),
      formData.userNotes,
      formData.coachNotes,
      formData.cancellationReason,
      formData.scheduledTime ? new Date(formData.scheduledTime) : undefined
    );
  }

  /**
   * Transform to form data for React Hook Form
   */
  public toFormData(): any {
    return {
      id: this.id,
      userId: this.userId,
      coachId: this.coachId,
      topic: this.topic,
      description: this.description || '',
      status: this.status,
      startTime: this.startTime?.toISOString() || '',
      endTime: this.endTime?.toISOString() || '',
      rating: this.rating?.toString() || '',
      feedback: this.feedback || '',
      userNotes: this.userNotes || '',
      coachNotes: this.coachNotes || '',
      cancellationReason: this.cancellationReason || '',
      scheduledTime: this.scheduledTime?.toISOString() || ''
    };
  }

  /**
   * Check if session is active
   */
  public isActive(): boolean {
    return this.status === 'in_progress';
  }

  /**
   * Check if session is completed
   */
  public isCompleted(): boolean {
    return this.status === 'completed';
  }

  /**
   * Check if session can be rated
   */
  public canBeRated(): boolean {
    return this.isCompleted() && !this.rating;
  }

  /**
   * Check if session can be started
   */
  public canBeStarted(): boolean {
    return this.status === 'accepted' && !this.startTime;
  }

  /**
   * Check if session can be ended
   */
  public canBeEnded(): boolean {
    return this.isActive() && this.startTime && !this.endTime;
  }

  /**
   * Get session duration in minutes
   */
  public getDuration(): number {
    if (!this.startTime || !this.endTime) {
      return 0;
    }
    
    const durationMs = this.endTime.getTime() - this.startTime.getTime();
    return Math.round(durationMs / (1000 * 60));
  }

  /**
   * Get remaining time in minutes (for active sessions)
   */
  public getRemainingTime(): number {
    if (!this.isActive() || !this.startTime) {
      return 0;
    }

    const now = new Date();
    const elapsedMs = now.getTime() - this.startTime.getTime();
    const totalDurationMs = 20 * 60 * 1000; // 20 minutes
    
    const remainingMs = totalDurationMs - elapsedMs;
    return Math.max(0, Math.round(remainingMs / (1000 * 60)));
  }

  /**
   * Check if session is about to end (5 minutes warning)
   */
  public isAboutToEnd(): boolean {
    return this.getRemainingTime() <= 5 && this.getRemainingTime() > 0;
  }

  /**
   * Check if session has exceeded time limit
   */
  public hasExceededTimeLimit(): boolean {
    return this.getRemainingTime() <= 0 && this.isActive();
  }

  /**
   * Get formatted duration string
   */
  public getFormattedDuration(): string {
    const duration = this.getDuration();
    return duration > 0 ? `${duration} min` : 'Not started';
  }

  /**
   * Get formatted remaining time string
   */
  public getFormattedRemainingTime(): string {
    const remaining = this.getRemainingTime();
    
    if (remaining <= 0) {
      return this.isActive() ? 'Time expired' : 'Not active';
    }
    
    return `${remaining} min remaining`;
  }

  /**
   * Check if session belongs to a specific user
   */
  public belongsToUser(userId: string): boolean {
    return this.userId === userId;
  }

  /**
   * Check if session belongs to a specific coach
   */
  public belongsToCoach(coachId: string): boolean {
    return this.coachId === coachId;
  }

  /**
   * Create a copy with updated fields
   */
  public copyWith(updates: Partial<SessionDTO>): SessionDTO {
    return new SessionDTO(
      updates.id ?? this.id,
      updates.userId ?? this.userId,
      updates.coachId ?? this.coachId,
      updates.topic ?? this.topic,
      updates.description ?? this.description,
      updates.status ?? this.status,
      updates.startTime ?? this.startTime,
      updates.endTime ?? this.endTime,
      updates.rating ?? this.rating,
      updates.feedback ?? this.feedback,
      updates.createdAt ?? this.createdAt,
      updates.updatedAt ?? this.updatedAt,
      updates.userNotes ?? this.userNotes,
      updates.coachNotes ?? this.coachNotes,
      updates.cancellationReason ?? this.cancellationReason,
      updates.scheduledTime ?? this.scheduledTime
    );
  }

  /**
   * Convert to plain object for serialization
   */
  public toJSON(): any {
    return {
      id: this.id,
      userId: this.userId,
      coachId: this.coachId,
      topic: this.topic,
      description: this.description,
      status: this.status,
      startTime: this.startTime?.toISOString(),
      endTime: this.endTime?.toISOString(),
      rating: this.rating,
      feedback: this.feedback,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      userNotes: this.userNotes,
      coachNotes: this.coachNotes,
      cancellationReason: this.cancellationReason,
      scheduledTime: this.scheduledTime?.toISOString(),
      duration: this.getDuration(),
      remainingTime: this.getRemainingTime(),
      isActive: this.isActive(),
      isCompleted: this.isCompleted(),
      canBeRated: this.canBeRated()
    };
  }
}

/**
 * Helper class for session transformations
 */
export class SessionTransformer {
  /**
   * Transform multiple API responses to DTOs
   */
  public static fromApiResponseList(apiDataList: SessionApiResponse[]): SessionDTO[] {
    return apiDataList.map(apiData => SessionDTO.fromApiResponse(apiData));
  }

  /**
   * Transform multiple DTOs to API requests
   */
  public static toApiRequestList(dtos: SessionDTO[]): SessionApiRequest[] {
    return dtos.map(dto => dto.toApiRequest());
  }

  /**
   * Filter sessions by status
   */
  public static filterByStatus(sessions: SessionDTO[], status: string): SessionDTO[] {
    return sessions.filter(session => session.status === status);
  }

  /**
   * Sort sessions by date (newest first)
   */
  public static sortByDate(sessions: SessionDTO[], ascending: boolean = false): SessionDTO[] {
    return sessions.sort((a, b) => {
      const dateA = a.createdAt.getTime();
      const dateB = b.createdAt.getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }

  /**
   * Group sessions by status
   */
  public static groupByStatus(sessions: SessionDTO[]): { [status: string]: SessionDTO[] } {
    return sessions.reduce((groups, session) => {
      const status = session.status;
      if (!groups[status]) {
        groups[status] = [];
      }
      groups[status].push(session);
      return groups;
    }, {} as { [status: string]: SessionDTO[] });
  }
}

/**
 * Example usage for developers:
 * 
 * import { SessionDTO, SessionTransformer } from '@/dto/SessionDTO';
 * 
 * // Transform API response
 * const session = SessionDTO.fromApiResponse(apiResponse);
 * 
 * // Check session status
 * if (session.isActive()) {
 *   console.log(`Session has ${session.getRemainingTime()} minutes remaining`);
 * }
 * 
 * // Transform to API request
 * const apiRequest = session.toApiRequest();
 * 
 * // Filter and sort sessions
 * const activeSessions = SessionTransformer.filterByStatus(sessions, 'in_progress');
 * const sortedSessions = SessionTransformer.sortByDate(sessions, true);
 */

import { PublisherBase } from './PublisherBase';
import { logger } from '@/utils/logger';

/**
 * Concrete Publisher Example for Session Events
 * Demonstrates real-world usage of the Publisher pattern in 20minCoach
 */
export class SessionPublisherExample extends PublisherBase {
  private static instance: SessionPublisherExample;

  // Private constructor for singleton pattern
  private constructor() {
    super();
    logger.info('SessionPublisherExample initialized');
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): SessionPublisherExample {
    if (!SessionPublisherExample.instance) {
      SessionPublisherExample.instance = new SessionPublisherExample();
    }
    return SessionPublisherExample.instance;
  }

  /**
   * Publish session requested event
   */
  public publishSessionRequested(sessionData: {
    sessionId: string;
    userId: string;
    coachId: string;
    topic: string;
    requestedAt: Date;
  }): void {
    logger.info('Publishing session requested event', sessionData);
    
    this.publish('session-requested', {
      ...sessionData,
      eventType: 'session-requested',
      timestamp: new Date().toISOString()
    });

    // Also emit via WebSocket for real-time notifications
    this.emitWebSocketEvent('session-requested', sessionData);
  }

  /**
   * Publish session accepted event
   */
  public publishSessionAccepted(sessionData: {
    sessionId: string;
    coachId: string;
    coachName: string;
    userId: string;
    acceptedAt: Date;
  }): void {
    logger.info('Publishing session accepted event', sessionData);
    
    this.publish('session-accepted', {
      ...sessionData,
      eventType: 'session-accepted',
      timestamp: new Date().toISOString()
    });

    this.emitWebSocketEvent('session-accepted', sessionData);
  }

  /**
   * Publish session started event
   */
  public publishSessionStarted(sessionData: {
    sessionId: string;
    startTime: Date;
    expectedEndTime: Date;
    participants: { userId: string; coachId: string };
  }): void {
    logger.info('Publishing session started event', sessionData);
    
    this.publish('session-started', {
      ...sessionData,
      eventType: 'session-started',
      timestamp: new Date().toISOString()
    });

    this.emitWebSocketEvent('session-started', sessionData);
  }

  /**
   * Publish session ended event
   */
  public publishSessionEnded(sessionData: {
    sessionId: string;
    endTime: Date;
    duration: number;
    userId: string;
    coachId: string;
    rating?: number;
  }): void {
    logger.info('Publishing session ended event', sessionData);
    
    this.publish('session-ended', {
      ...sessionData,
      eventType: 'session-ended',
      timestamp: new Date().toISOString()
    });

    this.emitWebSocketEvent('session-ended', sessionData);
  }

  /**
   * Publish session cancelled event
   */
  public publishSessionCancelled(sessionData: {
    sessionId: string;
    cancelledBy: 'user' | 'coach' | 'system';
    reason: string;
    cancelledAt: Date;
    userId?: string;
    coachId?: string;
  }): void {
    logger.info('Publishing session cancelled event', sessionData);
    
    this.publish('session-cancelled', {
      ...sessionData,
      eventType: 'session-cancelled',
      timestamp: new Date().toISOString()
    });

    this.emitWebSocketEvent('session-cancelled', sessionData);
  }

  /**
   * Publish session reminder event
   */
  public publishSessionReminder(sessionData: {
    sessionId: string;
    scheduledTime: Date;
    userId: string;
    coachId: string;
    reminderType: '15_minutes' | '1_hour' | '1_day';
  }): void {
    logger.info('Publishing session reminder event', sessionData);
    
    this.publish('session-reminder', {
      ...sessionData,
      eventType: 'session-reminder',
      timestamp: new Date().toISOString()
    });

    this.emitWebSocketEvent('session-reminder', sessionData);
  }

  /**
   * Publish session time warning event (5 minutes remaining)
   */
  public publishSessionTimeWarning(sessionData: {
    sessionId: string;
    remainingMinutes: number;
    endTime: Date;
  }): void {
    logger.info('Publishing session time warning event', sessionData);
    
    this.publish('session-time-warning', {
      ...sessionData,
      eventType: 'session-time-warning',
      timestamp: new Date().toISOString()
    });

    this.emitWebSocketEvent('session-time-warning', sessionData);
  }

  /**
   * Emit event via WebSocket for real-time communication
   */
  private emitWebSocketEvent(eventType: string, data: any): void {
    // This would integrate with your WebSocket service
    // For example, using Socket.IO
    try {
      if (typeof window !== 'undefined' && (window as any).socket) {
        (window as any).socket.emit('session-event', {
          type: eventType,
          data: data,
          timestamp: new Date().toISOString()
        });
        
        logger.debug('WebSocket event emitted', {
          eventType,
          sessionId: data.sessionId
        });
      }
    } catch (error) {
      logger.error('Failed to emit WebSocket event', error as Error, {
        eventType,
        data
      });
    }
  }

  /**
   * Get session event statistics
   */
  public getEventStatistics(): {
    totalEvents: number;
    eventsByType: { [eventType: string]: number };
    activeSubscribers: number;
  } {
    const eventTypes = this.getEventTypes();
    const eventsByType: { [eventType: string]: number } = {};

    eventTypes.forEach(eventType => {
      eventsByType[eventType] = this.getSubscriberCount(eventType);
    });

    return {
      totalEvents: this.getTotalSubscriberCount(),
      eventsByType,
      activeSubscribers: this.getTotalSubscriberCount()
    };
  }
}

/**
 * Concrete Publisher Example for Coach Events
 */
export class CoachPublisherExample extends PublisherBase {
  private static instance: CoachPublisherExample;

  private constructor() {
    super();
    logger.info('CoachPublisherExample initialized');
  }

  public static getInstance(): CoachPublisherExample {
    if (!CoachPublisherExample.instance) {
      CoachPublisherExample.instance = new CoachPublisherExample();
    }
    return CoachPublisherExample.instance;
  }

  /**
   * Publish coach availability change event
   */
  public publishCoachAvailabilityChanged(coachData: {
    coachId: string;
    available: boolean;
    previousAvailability: boolean;
    changedAt: Date;
    reason?: string;
  }): void {
    logger.info('Publishing coach availability changed event', coachData);
    
    this.publish('coach-availability-changed', {
      ...coachData,
      eventType: 'coach-availability-changed',
      timestamp: new Date().toISOString()
    });

    this.emitWebSocketEvent('coach-availability-changed', coachData);
  }

  /**
   * Publish coach profile updated event
   */
  public publishCoachProfileUpdated(coachData: {
    coachId: string;
    updatedFields: string[];
    updatedAt: Date;
    previousData?: any;
    newData?: any;
  }): void {
    logger.info('Publishing coach profile updated event', coachData);
    
    this.publish('coach-profile-updated', {
      ...coachData,
      eventType: 'coach-profile-updated',
      timestamp: new Date().toISOString()
    });

    this.emitWebSocketEvent('coach-profile-updated', coachData);
  }

  /**
   * Publish coach rating updated event
   */
  public publishCoachRatingUpdated(coachData: {
    coachId: string;
    newRating: number;
    previousRating: number;
    totalRatings: number;
    ratedBy: string;
    ratedAt: Date;
  }): void {
    logger.info('Publishing coach rating updated event', coachData);
    
    this.publish('coach-rating-updated', {
      ...coachData,
      eventType: 'coach-rating-updated',
      timestamp: new Date().toISOString()
    });

    this.emitWebSocketEvent('coach-rating-updated', coachData);
  }

  /**
   * Publish new coach registered event
   */
  public publishCoachRegistered(coachData: {
    coachId: string;
    name: string;
    specialties: string[];
    registeredAt: Date;
  }): void {
    logger.info('Publishing coach registered event', coachData);
    
    this.publish('coach-registered', {
      ...coachData,
      eventType: 'coach-registered',
      timestamp: new Date().toISOString()
    });

    this.emitWebSocketEvent('coach-registered', coachData);
  }

  /**
   * Emit event via WebSocket
   */
  private emitWebSocketEvent(eventType: string, data: any): void {
    try {
      if (typeof window !== 'undefined' && (window as any).socket) {
        (window as any).socket.emit('coach-event', {
          type: eventType,
          data: data,
          timestamp: new Date().toISOString()
        });
        
        logger.debug('WebSocket coach event emitted', {
          eventType,
          coachId: data.coachId
        });
      }
    } catch (error) {
      logger.error('Failed to emit WebSocket coach event', error as Error, {
        eventType,
        data
      });
    }
  }
}

/**
 * Example usage in controllers for developers:
 * 
 * // In a session controller
 * import { SessionPublisherExample } from '@/controllers/PublisherExample';
 * 
 * export class SessionController {
 *   private sessionPublisher: SessionPublisherExample;
 * 
 *   constructor() {
 *     this.sessionPublisher = SessionPublisherExample.getInstance();
 *   }
 * 
 *   public async createSession(request: CreateSessionRequest) {
 *     try {
 *       // Business logic to create session...
 *       const session = await sessionService.createSession(request);
 * 
 *       // Publish session requested event
 *       this.sessionPublisher.publishSessionRequested({
 *         sessionId: session.id,
 *         userId: session.userId,
 *         coachId: session.coachId,
 *         topic: session.topic,
 *         requestedAt: new Date()
 *       });
 * 
 *       return session;
 *     } catch (error) {
 *       logger.error('Failed to create session', error as Error);
 *       throw error;
 *     }
 *   }
 * 
 *   public async acceptSession(sessionId: string, coachId: string) {
 *     try {
 *       // Business logic to accept session...
 *       const session = await sessionService.acceptSession(sessionId);
 * 
 *       // Publish session accepted event
 *       this.sessionPublisher.publishSessionAccepted({
 *         sessionId: session.id,
 *         coachId: coachId,
 *         coachName: 'Coach Name', // You would get this from coach service
 *         userId: session.userId,
 *         acceptedAt: new Date()
 *       });
 * 
 *       return session;
 *     } catch (error) {
 *       logger.error('Failed to accept session', error as Error);
 *       throw error;
 *     }
 *   }
 * }
 * 
 * // In a coach controller
 * import { CoachPublisherExample } from '@/controllers/PublisherExample';
 * 
 * export class CoachController {
 *   private coachPublisher: CoachPublisherExample;
 * 
 *   constructor() {
 *     this.coachPublisher = CoachPublisherExample.getInstance();
 *   }
 * 
 *   public async updateAvailability(coachId: string, available: boolean) {
 *     try {
 *       const previousAvailability = await coachService.getAvailability(coachId);
 *       
 *       // Business logic to update availability...
 *       await coachService.updateAvailability(coachId, available);
 * 
 *       // Publish availability change event
 *       this.coachPublisher.publishCoachAvailabilityChanged({
 *         coachId,
 *         available,
 *         previousAvailability,
 *         changedAt: new Date(),
 *         reason: 'Manual update by coach'
 *       });
 * 
 *     } catch (error) {
 *       logger.error('Failed to update coach availability', error as Error);
 *       throw error;
 *     }
 *   }
 * 
 *   public async updateProfile(coachId: string, updates: any) {
 *     try {
 *       const previousData = await coachService.getCoachProfile(coachId);
 *       
 *       // Business logic to update profile...
 *       const updatedCoach = await coachService.updateProfile(coachId, updates);
 * 
 *       // Publish profile updated event
 *       this.coachPublisher.publishCoachProfileUpdated({
 *         coachId,
 *         updatedFields: Object.keys(updates),
 *         updatedAt: new Date(),
 *         previousData,
 *         newData: updatedCoach
 *       });
 * 
 *       return updatedCoach;
 *     } catch (error) {
 *       logger.error('Failed to update coach profile', error as Error);
 *       throw error;
 *     }
 *   }
 * }
 * 
 * // Example of subscribing to events in a component:
 * 
 * import { SessionPublisherExample } from '@/controllers/PublisherExample';
 * import { useEffect } from 'react';
 * 
 * export const SessionNotifications: React.FC = () => {
 *   useEffect(() => {
 *     const sessionPublisher = SessionPublisherExample.getInstance();
 * 
 *     const handleSessionAccepted = (data: any) => {
 *       // Show notification to user
 *       showNotification('Session Accepted', `Coach has accepted your session: ${data.topic}`);
 *     };
 * 
 *     const handleSessionReminder = (data: any) => {
 *       // Show reminder notification
 *       showNotification('Session Reminder', `Your session starts in ${data.reminderType}`);
 *     };
 * 
 *     // Subscribe to events
 *     sessionPublisher.subscribe('session-accepted', handleSessionAccepted);
 *     sessionPublisher.subscribe('session-reminder', handleSessionReminder);
 * 
 *     // Cleanup on component unmount
 *     return () => {
 *       sessionPublisher.unsubscribe('session-accepted', handleSessionAccepted);
 *       sessionPublisher.unsubscribe('session-reminder', handleSessionReminder);
 *     };
 *   }, []);
 * 
 *   return <div>Session Notifications Component</div>;
 * };
 */

import { SubscriberBase } from './SubscriberBase';
import { logger } from '@/utils/logger';

/**
 * Example concrete subscriber for session events
 * Demonstrates how to create specialized subscribers
 */
export class SessionNotificationSubscriber extends SubscriberBase {
  private userDeviceTokens: Map<string, string> = new Map();

  constructor() {
    super('session-notification-subscriber');
  }

  /**
   * Handle session-related events
   */
  public async handleEvent(eventType: string, data: any): Promise<void> {
    logger.info(`SessionNotificationSubscriber handling event: ${eventType}`, {
      eventType,
      data,
      subscriberId: this.subscriberId
    });

    switch (eventType) {
      case 'session-requested':
        await this.handleSessionRequested(data);
        break;
      
      case 'session-accepted':
        await this.handleSessionAccepted(data);
        break;
      
      case 'session-started':
        await this.handleSessionStarted(data);
        break;
      
      case 'session-ended':
        await this.handleSessionEnded(data);
        break;
      
      case 'session-cancelled':
        await this.handleSessionCancelled(data);
        break;
      
      default:
        logger.warn(`Unknown event type: ${eventType}`, {
          eventType,
          subscriberId: this.subscriberId
        });
    }
  }

  /**
   * Handle session requested event
   */
  private async handleSessionRequested(data: any): Promise<void> {
    const { sessionId, coachId, userId } = data;

    // Notify coach about new session request
    await this.showBrowserNotification('New Session Request', {
      body: `You have a new session request from a user`,
      tag: `session-request-${sessionId}`
    });

    // Send push notification to coach's mobile device
    const coachToken = this.userDeviceTokens.get(coachId);
    if (coachToken) {
      await this.sendPushNotification(coachToken, {
        title: 'New Session Request',
        body: 'A user has requested a coaching session',
        data: { sessionId, type: 'session-requested' }
      });
    }

    logger.info('Processed session requested event', {
      sessionId,
      coachId,
      userId,
      subscriberId: this.subscriberId
    });
  }

  /**
   * Handle session accepted event
   */
  private async handleSessionAccepted(data: any): Promise<void> {
    const { sessionId, coachName, userId } = data;

    // Notify user that coach accepted
    await this.showBrowserNotification('Session Accepted!', {
      body: `${coachName} has accepted your session request`,
      tag: `session-accepted-${sessionId}`
    });

    // Send push notification to user
    const userToken = this.userDeviceTokens.get(userId);
    if (userToken) {
      await this.sendPushNotification(userToken, {
        title: 'Session Accepted',
        body: `${coachName} is ready for your session`,
        data: { sessionId, type: 'session-accepted' }
      });
    }

    logger.info('Processed session accepted event', {
      sessionId,
      coachName,
      userId,
      subscriberId: this.subscriberId
    });
  }

  /**
   * Handle session started event
   */
  private async handleSessionStarted(data: any): Promise<void> {
    const { sessionId } = data;

    await this.showBrowserNotification('Session Starting', {
      body: 'Your coaching session is starting now',
      tag: `session-started-${sessionId}`
    });

    logger.info('Processed session started event', {
      sessionId,
      subscriberId: this.subscriberId
    });
  }

  /**
   * Handle session ended event
   */
  private async handleSessionEnded(data: any): Promise<void> {
    const { sessionId, duration } = data;

    await this.showBrowserNotification('Session Completed', {
      body: `Your ${duration}-minute session has ended. Please provide feedback.`,
      tag: `session-ended-${sessionId}`
    });

    logger.info('Processed session ended event', {
      sessionId,
      duration,
      subscriberId: this.subscriberId
    });
  }

  /**
   * Handle session cancelled event
   */
  private async handleSessionCancelled(data: any): Promise<void> {
    const { sessionId, reason, cancelledBy } = data;

    await this.showBrowserNotification('Session Cancelled', {
      body: `Session was cancelled by ${cancelledBy}. Reason: ${reason}`,
      tag: `session-cancelled-${sessionId}`
    });

    logger.info('Processed session cancelled event', {
      sessionId,
      reason,
      cancelledBy,
      subscriberId: this.subscriberId
    });
  }

  /**
   * Register a user's device token for push notifications
   */
  public registerDeviceToken(userId: string, deviceToken: string): void {
    this.userDeviceTokens.set(userId, deviceToken);
    logger.debug('Device token registered for user', {
      userId,
      tokenPreview: deviceToken.substring(0, 8) + '...',
      subscriberId: this.subscriberId
    });
  }

  /**
   * Unregister a user's device token
   */
  public unregisterDeviceToken(userId: string): void {
    this.userDeviceTokens.delete(userId);
    logger.debug('Device token unregistered for user', {
      userId,
      subscriberId: this.subscriberId
    });
  }

  /**
   * Get registered device tokens count
   */
  public getRegisteredTokensCount(): number {
    return this.userDeviceTokens.size;
  }
}

/**
 * Example usage for developers:
 * 
 * // Create subscriber instance
 * const sessionNotifier = new SessionNotificationSubscriber();
 * 
 * // Get publisher instance
 * const sessionPublisher = SessionPublisher.getInstance();
 * 
 * // Subscribe to events
 * sessionPublisher.subscribe('session-requested', (data) => {
 *   sessionNotifier.processEvent('session-requested', data);
 * });
 * 
 * sessionPublisher.subscribe('session-accepted', (data) => {
 *   sessionNotifier.processEvent('session-accepted', data);
 * });
 * 
 * // Register device token for push notifications
 * sessionNotifier.registerDeviceToken('user123', 'device-token-abc123');
 * 
 * // Publish an event
 * sessionPublisher.sessionRequested({
 *   sessionId: 'sess_123',
 *   coachId: 'coach_456',
 *   userId: 'user_789'
 * });
 */

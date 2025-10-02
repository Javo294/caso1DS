import { logger } from '@/utils/logger';

/**
 * Abstract base class for all subscribers in the application
 * Implements the Subscriber part of the Observer pattern
 */
export abstract class SubscriberBase {
  protected subscriberId: string;
  protected isActive: boolean = true;

  constructor(subscriberId?: string) {
    this.subscriberId = subscriberId || this.generateSubscriberId();
  }

  /**
   * Generate a unique subscriber ID
   */
  private generateSubscriberId(): string {
    return `subscriber-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Abstract method that must be implemented by concrete subscribers
   */
  public abstract handleEvent(eventType: string, data: any): void;

  /**
   * Common event handling with logging and error handling
   */
  protected processEvent(eventType: string, data: any): void {
    if (!this.isActive) {
      logger.warn(`Subscriber ${this.subscriberId} is inactive, ignoring event`, {
        eventType,
        subscriberId: this.subscriberId
      });
      return;
    }

    try {
      logger.debug(`Subscriber ${this.subscriberId} processing event`, {
        eventType,
        subscriberId: this.subscriberId,
        data
      });

      this.handleEvent(eventType, data);

      logger.debug(`Subscriber ${this.subscriberId} successfully processed event`, {
        eventType,
        subscriberId: this.subscriberId
      });
    } catch (error) {
      logger.error(`Error in subscriber ${this.subscriberId} while processing event`, error as Error, {
        eventType,
        subscriberId: this.subscriberId,
        data
      });
    }
  }

  /**
   * Activate the subscriber
   */
  public activate(): void {
    this.isActive = true;
    logger.info(`Subscriber activated`, { subscriberId: this.subscriberId });
  }

  /**
   * Deactivate the subscriber
   */
  public deactivate(): void {
    this.isActive = false;
    logger.info(`Subscriber deactivated`, { subscriberId: this.subscriberId });
  }

  /**
   * Get subscriber status
   */
  public getStatus(): { subscriberId: string; isActive: boolean } {
    return {
      subscriberId: this.subscriberId,
      isActive: this.isActive
    };
  }

  /**
   * Show browser notification (if permissions granted)
   */
  protected async showBrowserNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (!('Notification' in window)) {
      logger.warn('Browser notifications not supported');
      return;
    }

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        logger.warn('Browser notification permission denied');
        return;
      }
    }

    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });
    }
  }

  /**
   * Send push notification to mobile devices
   */
  protected async sendPushNotification(deviceToken: string, notification: any): Promise<void> {
    // This would integrate with a push notification service
    // For now, we'll log the intent
    logger.info('Sending push notification', {
      deviceToken: deviceToken.substring(0, 8) + '...', // Log partial token for security
      notification,
      subscriberId: this.subscriberId
    });

    // Implementation would go here for services like Firebase Cloud Messaging
    // await pushService.send(deviceToken, notification);
  }
}

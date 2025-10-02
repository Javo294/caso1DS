import { logger } from '@/utils/logger';

/**
 * Abstract base class for all publishers in the application
 * Implements the Publisher part of the Observer pattern
 */
export abstract class PublisherBase {
  private subscribers: Map<string, Function[]> = new Map();

  /**
   * Subscribe a callback function to a specific event
   */
  public subscribe(eventType: string, callback: Function): void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    
    const eventSubscribers = this.subscribers.get(eventType)!;
    if (!eventSubscribers.includes(callback)) {
      eventSubscribers.push(callback);
      logger.debug(`New subscriber added for event: ${eventType}`, {
        eventType,
        subscriberCount: eventSubscribers.length
      });
    }
  }

  /**
   * Unsubscribe a callback function from a specific event
   */
  public unsubscribe(eventType: string, callback: Function): void {
    const subscribers = this.subscribers.get(eventType);
    if (subscribers) {
      const initialLength = subscribers.length;
      this.subscribers.set(
        eventType, 
        subscribers.filter(sub => sub !== callback)
      );
      
      logger.debug(`Subscriber removed from event: ${eventType}`, {
        eventType,
        removed: initialLength > subscribers.length,
        remainingSubscribers: subscribers.length - 1
      });
    }
  }

  /**
   * Publish an event to all subscribers
   */
  protected publish(eventType: string, data: any): void {
    logger.info(`Publishing event: ${eventType}`, {
      eventType,
      data,
      subscriberCount: this.subscribers.get(eventType)?.length || 0
    });

    const subscribers = this.subscribers.get(eventType) || [];
    
    subscribers.forEach((callback, index) => {
      try {
        callback(data);
        logger.debug(`Event delivered to subscriber ${index}`, {
          eventType,
          subscriberIndex: index
        });
      } catch (error) {
        logger.error(`Error in event subscriber for ${eventType}`, error as Error, {
          eventType,
          subscriberIndex: index,
          data
        });
      }
    });
  }

  /**
   * Get subscriber count for a specific event
   */
  public getSubscriberCount(eventType: string): number {
    return this.subscribers.get(eventType)?.length || 0;
  }

  /**
   * Get all registered event types
   */
  public getEventTypes(): string[] {
    return Array.from(this.subscribers.keys());
  }

  /**
   * Clear all subscribers for a specific event
   */
  public clearSubscribers(eventType: string): void {
    const count = this.getSubscriberCount(eventType);
    this.subscribers.delete(eventType);
    
    logger.info(`Cleared all subscribers for event: ${eventType}`, {
      eventType,
      removedSubscribers: count
    });
  }

  /**
   * Clear all subscribers for all events
   */
  public clearAllSubscribers(): void {
    const totalSubscribers = this.getTotalSubscriberCount();
    this.subscribers.clear();
    
    logger.info('Cleared all subscribers for all events', {
      totalSubscribersCleared: totalSubscribers
    });
  }

  /**
   * Get total subscriber count across all events
   */
  public getTotalSubscriberCount(): number {
    let total = 0;
    for (const subscribers of this.subscribers.values()) {
      total += subscribers.length;
    }
    return total;
  }
}

/**
 * Concrete publisher for session-related events
 */
export class SessionPublisher extends PublisherBase {
  private static instance: SessionPublisher;

  public static getInstance(): SessionPublisher {
    if (!SessionPublisher.instance) {
      SessionPublisher.instance = new SessionPublisher();
    }
    return SessionPublisher.instance;
  }

  public sessionRequested(sessionData: any): void {
    this.publish('session-requested', sessionData);
  }

  public sessionAccepted(sessionData: any): void {
    this.publish('session-accepted', sessionData);
  }

  public sessionStarted(sessionData: any): void {
    this.publish('session-started', sessionData);
  }

  public sessionEnded(sessionData: any): void {
    this.publish('session-ended', sessionData);
  }

  public sessionCancelled(sessionData: any): void {
    this.publish('session-cancelled', sessionData);
  }
}

/**
 * Concrete publisher for coach-related events
 */
export class CoachPublisher extends PublisherBase {
  private static instance: CoachPublisher;

  public static getInstance(): CoachPublisher {
    if (!CoachPublisher.instance) {
      CoachPublisher.instance = new CoachPublisher();
    }
    return CoachPublisher.instance;
  }

  public coachAvailable(coachData: any): void {
    this.publish('coach-available', coachData);
  }

  public coachUnavailable(coachData: any): void {
    this.publish('coach-unavailable', coachData);
  }

  public coachRatingUpdated(coachData: any): void {
    this.publish('coach-rating-updated', coachData);
  }
}

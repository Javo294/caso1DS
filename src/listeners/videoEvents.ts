//Código generado por IA, falta documentación

import { logger } from '@/utils/logger';
import socket from './websocket';

export class VideoEventPublisher {
  private subscribers: Map<string, Function[]> = new Map();

  public subscribe(eventType: string, callback: Function): void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType)!.push(callback);
  }

  public unsubscribe(eventType: string, callback: Function): void {
    const subscribers = this.subscribers.get(eventType);
    if (subscribers) {
      this.subscribers.set(
        eventType, 
        subscribers.filter(sub => sub !== callback)
      );
    }
  }

  public publish(eventType: string, data: any): void {
    logger.info(`Publishing video event: ${eventType}`, data);
    
    const subscribers = this.subscribers.get(eventType) || [];
    subscribers.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        logger.error('Error in video event subscriber', error as Error, { eventType });
      }
    });

    // Also emit via WebSocket for real-time updates
    socket.emit('video-event', { type: eventType, data });
  }

  // Specific event methods
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
}

export const videoEventPublisher = new VideoEventPublisher();

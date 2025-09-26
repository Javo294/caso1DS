// Código generado por IA, falta documentación

import { logger } from '@/utils/logger';
import { videoEventPublisher } from './videoEvents';

class WebSocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;

  public connect(): void {
    try {
      this.socket = io(process.env.REACT_APP_WS_URL || 'ws://localhost:3001', {
        auth: {
          token: localStorage.getItem('accessToken')
        }
      });

      this.socket.on('connect', () => {
        this.isConnected = true;
        logger.info('WebSocket connected successfully');
      });

      this.socket.on('disconnect', () => {
        this.isConnected = false;
        logger.warn('WebSocket disconnected');
      });

      this.setupEventListeners();
    } catch (error) {
      logger.error('WebSocket connection failed', error as Error);
    }
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    // Subscribe to server events and republish locally
    this.socket.on('session-update', (data) => {
      logger.debug('Received session update via WebSocket', data);
      videoEventPublisher.publish('session-update', data);
    });

    this.socket.on('coach-availability', (data) => {
      logger.debug('Received coach availability update', data);
      videoEventPublisher.publish('coach-availability', data);
    });

    this.socket.on('notification', (data) => {
      this.showBrowserNotification(data);
      videoEventPublisher.publish('notification', data);
    });
  }

  private showBrowserNotification(data: any): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(data.title, {
        body: data.message,
        icon: '/icon.png'
      });
    }
  }

  public emit(event: string, data: any): void {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
    }
  }
}

export default new WebSocketService();

// Usage example for subscribers:
/*
import { videoEventPublisher } from '@/listeners/videoEvents';
import { useEffect } from 'react';

export const SessionNotificationComponent: React.FC = () => {
  useEffect(() => {
    const handleSessionAccepted = (data: any) => {
      // Update UI when session is accepted
      console.log('Session accepted:', data);
    };

    // Subscribe to events
    videoEventPublisher.subscribe('session-accepted', handleSessionAccepted);

    // Cleanup on unmount
    return () => {
      videoEventPublisher.unsubscribe('session-accepted', handleSessionAccepted);
    };
  }, []);
};
*/

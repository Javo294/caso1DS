import * as Sentry from '@sentry/react';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

class Logger {
  private static instance: Logger;
  private service: string;

  private constructor(service: string) {
    this.service = service;
  }

  public static getInstance(service: string = 'frontend'): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(service);
    }
    return Logger.instance;
  }

  private log(level: LogLevel, message: string, extra?: any): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      service: this.service,
      message,
      userId: this.getUserId(),
      ...extra
    };

    // Console output for development
    if (process.env.NODE_ENV === 'development') {
      console[level](logEntry);
    }

    // Sentry for production
    if (process.env.NODE_ENV === 'production') {
      switch (level) {
        case LogLevel.ERROR:
          Sentry.captureException(new Error(message), { extra });
          break;
        case LogLevel.WARN:
          Sentry.captureMessage(message, { level: 'warning' });
          break;
        default:
          Sentry.addBreadcrumb({ message, level, data: extra });
      }
    }
  }

  private getUserId(): string | null {
    // Implementation depends on your auth system
    const authState = localStorage.getItem('authState');
    return authState ? JSON.parse(authState).user?.id : null;
  }

  public error(message: string, error?: Error, extra?: any): void {
    this.log(LogLevel.ERROR, message, { error, ...extra });
  }

  public warn(message: string, extra?: any): void {
    this.log(LogLevel.WARN, message, extra);
  }

  public info(message: string, extra?: any): void {
    this.log(LogLevel.INFO, message, extra);
  }

  public debug(message: string, extra?: any): void {
    if (process.env.NODE_ENV === 'development') {
      this.log(LogLevel.DEBUG, message, extra);
    }
  }
}

// Usage example for developers
export const logger = Logger.getInstance('20minCoach-frontend');

// Example usage in a component:
/*
import { logger } from '@/utils/logger';

export const CoachSearchComponent: React.FC = () => {
  const searchCoaches = async (query: string) => {
    try {
      logger.info('Initiating coach search', { query });
      
      const results = await coachService.search(query);
      logger.debug('Coach search completed', { resultCount: results.length });
      
      return results;
    } catch (error) {
      logger.error('Coach search failed', error as Error, { query });
      throw error;
    }
  };
};
*/

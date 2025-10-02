import { SessionDTO } from '@/dto/SessionDTO';
import { BaseException } from '@/exceptions/BaseException';
import { logger } from '@/utils/logger';

/**
 * Validation rules for Session entities
 */
export interface ValidationRule {
  validate(value: any, context?: string): void;
  getMessage(field?: string): string;
}

/**
 * Rule for required fields
 */
export class RequiredRule implements ValidationRule {
  validate(value: any, context?: string): void {
    if (value === null || value === undefined || value === '') {
      throw new BaseException(
        this.getMessage(context),
        'VALIDATION_ERROR',
        { field: context, value }
      );
    }
  }

  getMessage(field?: string): string {
    return field ? `${field} is required` : 'Field is required';
  }
}

/**
 * Rule for string length validation
 */
export class StringLengthRule implements ValidationRule {
  constructor(
    private minLength?: number,
    private maxLength?: number
  ) {}

  validate(value: string, context?: string): void {
    if (value === undefined || value === null) return;

    if (this.minLength && value.length < this.minLength) {
      throw new BaseException(
        this.getMessage(context),
        'VALIDATION_ERROR',
        { 
          field: context, 
          value, 
          minLength: this.minLength,
          actualLength: value.length
        }
      );
    }

    if (this.maxLength && value.length > this.maxLength) {
      throw new BaseException(
        this.getMessage(context),
        'VALIDATION_ERROR',
        { 
          field: context, 
          value, 
          maxLength: this.maxLength,
          actualLength: value.length
        }
      );
    }
  }

  getMessage(field?: string): string {
    const fieldText = field ? `${field} ` : '';
    
    if (this.minLength && this.maxLength) {
      return `${fieldText}must be between ${this.minLength} and ${this.maxLength} characters`;
    } else if (this.minLength) {
      return `${fieldText}must be at least ${this.minLength} characters`;
    } else {
      return `${fieldText}must be at most ${this.maxLength} characters`;
    }
  }
}

/**
 * Rule for session status validation
 */
export class SessionStatusRule implements ValidationRule {
  private allowedStatuses = ['requested', 'accepted', 'in_progress', 'completed', 'cancelled'];

  validate(value: string, context?: string): void {
    if (!this.allowedStatuses.includes(value)) {
      throw new BaseException(
        this.getMessage(context),
        'VALIDATION_ERROR',
        { 
          field: context, 
          value, 
          allowedStatuses: this.allowedStatuses 
        }
      );
    }
  }

  getMessage(field?: string): string {
    const fieldText = field ? `${field} ` : '';
    return `${fieldText}must be one of: ${this.allowedStatuses.join(', ')}`;
  }
}

/**
 * Rule for rating validation
 */
export class RatingRule implements ValidationRule {
  constructor(private min: number = 1, private max: number = 5) {}

  validate(value: number, context?: string): void {
    if (value === undefined || value === null) return;

    if (value < this.min || value > this.max) {
      throw new BaseException(
        this.getMessage(context),
        'VALIDATION_ERROR',
        { 
          field: context, 
          value, 
          min: this.min, 
          max: this.max 
        }
      );
    }
  }

  getMessage(field?: string): string {
    const fieldText = field ? `${field} ` : '';
    return `${fieldText}must be between ${this.min} and ${this.max}`;
  }
}

/**
 * Rule for date validation
 */
export class DateRule implements ValidationRule {
  validate(value: Date | string, context?: string): void {
    if (value === undefined || value === null) return;

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new BaseException(
        this.getMessage(context),
        'VALIDATION_ERROR',
        { field: context, value }
      );
    }
  }

  getMessage(field?: string): string {
    return field ? `${field} must be a valid date` : 'Invalid date format';
  }
}

/**
 * Rule for future date validation
 */
export class FutureDateRule implements ValidationRule {
  validate(value: Date | string, context?: string): void {
    if (value === undefined || value === null) return;

    const date = new Date(value);
    const now = new Date();

    if (date <= now) {
      throw new BaseException(
        this.getMessage(context),
        'VALIDATION_ERROR',
        { field: context, value, now: now.toISOString() }
      );
    }
  }

  getMessage(field?: string): string {
    return field ? `${field} must be a future date` : 'Date must be in the future';
  }
}

/**
 * Main Session Validator using Decorator Pattern
 */
export class SessionValidator {
  private rules: Map<string, ValidationRule[]> = new Map();

  constructor() {
    this.setupDefaultRules();
  }

  /**
   * Setup default validation rules for sessions
   */
  private setupDefaultRules(): void {
    // ID validation
    this.rules.set('id', [new RequiredRule()]);
    
    // User and Coach ID validation
    this.rules.set('userId', [new RequiredRule(), new StringLengthRule(1, 50)]);
    this.rules.set('coachId', [new RequiredRule(), new StringLengthRule(1, 50)]);
    
    // Topic and description validation
    this.rules.set('topic', [new RequiredRule(), new StringLengthRule(5, 100)]);
    this.rules.set('description', [new StringLengthRule(0, 500)]);
    
    // Status validation
    this.rules.set('status', [new RequiredRule(), new SessionStatusRule()]);
    
    // Rating validation
    this.rules.set('rating', [new RatingRule(1, 5)]);
    
    // Date validation
    this.rules.set('startTime', [new DateRule()]);
    this.rules.set('endTime', [new DateRule()]);
    this.rules.set('createdAt', [new RequiredRule(), new DateRule()]);
    this.rules.set('updatedAt', [new RequiredRule(), new DateRule()]);
  }

  /**
   * Validate a SessionDTO instance
   */
  public validate(session: SessionDTO): void {
    logger.debug('Validating session', { sessionId: session.id });

    // Validate individual fields
    for (const [field, rules] of this.rules.entries()) {
      const value = (session as any)[field];
      
      for (const rule of rules) {
        rule.validate(value, field);
      }
    }

    // Validate business rules
    this.validateBusinessRules(session);

    logger.debug('Session validation successful', { sessionId: session.id });
  }

  /**
   * Validate session-specific business rules
   */
  private validateBusinessRules(session: SessionDTO): void {
    // Validate session duration (max 20 minutes)
    if (session.startTime && session.endTime) {
      const duration = session.endTime.getTime() - session.startTime.getTime();
      const maxDuration = 20 * 60 * 1000; // 20 minutes in milliseconds
      
      if (duration > maxDuration) {
        throw new BaseException(
          'Session duration cannot exceed 20 minutes',
          'VALIDATION_ERROR',
          { 
            sessionId: session.id,
            duration: `${duration / 60000} minutes`,
            maxDuration: '20 minutes'
          }
        );
      }
    }

    // Validate that end time is after start time
    if (session.startTime && session.endTime && session.endTime <= session.startTime) {
      throw new BaseException(
        'Session end time must be after start time',
        'VALIDATION_ERROR',
        { 
          sessionId: session.id,
          startTime: session.startTime.toISOString(),
          endTime: session.endTime.toISOString()
        }
      );
    }

    // Validate that only completed sessions can be rated
    if (session.rating && session.status !== 'completed') {
      throw new BaseException(
        'Only completed sessions can be rated',
        'VALIDATION_ERROR',
        { 
          sessionId: session.id,
          status: session.status,
          rating: session.rating
        }
      );
    }

    // Validate that cancelled sessions cannot be started
    if (session.status === 'cancelled' && session.startTime) {
      throw new BaseException(
        'Cancelled sessions cannot be started',
        'VALIDATION_ERROR',
        { sessionId: session.id }
      );
    }
  }

  /**
   * Validate session creation request
   */
  public validateCreationRequest(request: any): void {
    const requiredFields = ['userId', 'coachId', 'topic'];
    
    for (const field of requiredFields) {
      if (!request[field]) {
        throw new BaseException(
          `${field} is required for session creation`,
          'VALIDATION_ERROR',
          { field, request }
        );
      }
    }

    // Validate topic length
    if (request.topic && request.topic.length < 5) {
      throw new BaseException(
        'Topic must be at least 5 characters long',
        'VALIDATION_ERROR',
        { topic: request.topic, length: request.topic.length }
      );
    }

    // Validate description length if provided
    if (request.description && request.description.length > 500) {
      throw new BaseException(
        'Description cannot exceed 500 characters',
        'VALIDATION_ERROR',
        { descriptionLength: request.description.length }
      );
    }
  }

  /**
   * Validate session status transition
   */
  public validateStatusTransition(currentStatus: string, newStatus: string): void {
    const allowedTransitions: { [key: string]: string[] } = {
      'requested': ['accepted', 'cancelled'],
      'accepted': ['in_progress', 'cancelled'],
      'in_progress': ['completed', 'cancelled'],
      'completed': [], // No transitions from completed
      'cancelled': [] // No transitions from cancelled
    };

    const allowedNextStatuses = allowedTransitions[currentStatus] || [];
    
    if (!allowedNextStatuses.includes(newStatus)) {
      throw new BaseException(
        `Cannot transition from ${currentStatus} to ${newStatus}`,
        'VALIDATION_ERROR',
        { 
          currentStatus, 
          newStatus, 
          allowedTransitions: allowedNextStatuses 
        }
      );
    }

    logger.debug('Status transition validated', {
      from: currentStatus,
      to: newStatus
    });
  }

  /**
   * Add custom validation rule for a field
   */
  public addRule(field: string, rule: ValidationRule): void {
    if (!this.rules.has(field)) {
      this.rules.set(field, []);
    }
    this.rules.get(field)!.push(rule);
    
    logger.debug('Custom validation rule added', { field });
  }

  /**
   * Remove all validation rules for a field
   */
  public clearRules(field: string): void {
    this.rules.delete(field);
    logger.debug('Validation rules cleared', { field });
  }

  /**
   * Get all validation rules for a field
   */
  public getRules(field: string): ValidationRule[] {
    return this.rules.get(field) || [];
  }
}

// Export singleton instance
export const sessionValidator = new SessionValidator();

/**
 * Example usage for developers:
 * 
 * import { sessionValidator } from '@/validators/SessionValidator';
 * import { SessionDTO } from '@/dto/SessionDTO';
 * 
 * // Validate a session
 * try {
 *   sessionValidator.validate(session);
 *   console.log('Session is valid');
 * } catch (error) {
 *   console.error('Validation failed:', error.message);
 * }
 * 
 * // Validate status transition
 * try {
 *   sessionValidator.validateStatusTransition('requested', 'accepted');
 *   console.log('Status transition is valid');
 * } catch (error) {
 *   console.error('Invalid status transition:', error.message);
 * }
 * 
 * // Add custom rule
 * sessionValidator.addRule('topic', new StringLengthRule(10, 200));
 */

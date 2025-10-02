import { CoachDTO } from '@/dto/CoachDTO';
import { BaseException } from '@/exceptions/BaseException';

export interface ValidationRule {
  validate(value: any, field: string): void;
  getMessage(field: string): string;
}

export class RequiredRule implements ValidationRule {
  validate(value: any, field: string): void {
    if (value === null || value === undefined || value === '') {
      throw new BaseException(this.getMessage(field), 'VALIDATION_ERROR', { field, value });
    }
  }

  getMessage(field: string): string {
    return `${field} is required`;
  }
}

export class MinLengthRule implements ValidationRule {
  constructor(private minLength: number) {}

  validate(value: string, field: string): void {
    if (value && value.length < this.minLength) {
      throw new BaseException(this.getMessage(field), 'VALIDATION_ERROR', { 
        field, 
        value, 
        minLength: this.minLength 
      });
    }
  }

  getMessage(field: string): string {
    return `${field} must be at least ${this.minLength} characters long`;
  }
}

export class RatingRangeRule implements ValidationRule {
  constructor(private min: number = 0, private max: number = 5) {}

  validate(value: number, field: string): void {
    if (value < this.min || value > this.max) {
      throw new BaseException(this.getMessage(field), 'VALIDATION_ERROR', { 
        field, 
        value, 
        min: this.min, 
        max: this.max 
      });
    }
  }

  getMessage(field: string): string {
    return `${field} must be between ${this.min} and ${this.max}`;
  }
}

// Main Coach Validator using Decorator Pattern
export class CoachValidator {
  private rules: Map<string, ValidationRule[]> = new Map();

  constructor() {
    this.setupRules();
  }

  private setupRules(): void {
    this.rules.set('id', [new RequiredRule()]);
    this.rules.set('name', [new RequiredRule(), new MinLengthRule(2)]);
    this.rules.set('rating', [new RequiredRule(), new RatingRangeRule(0, 5)]);
    this.rules.set('specialties', [new RequiredRule()]);
    this.rules.set('hourlyRate', [new RequiredRule()]);
  }

  public validate(coach: CoachDTO): void {
    for (const [field, rules] of this.rules.entries()) {
      const value = (coach as any)[field];
      
      for (const rule of rules) {
        rule.validate(value, field);
      }
    }

    // Custom business rule validation
    this.validateSpecialties(coach.specialties);
    this.validateHourlyRate(coach.hourlyRate);
  }

  private validateSpecialties(specialties: string[]): void {
    if (specialties.length > 10) {
      throw new BaseException(
        'A coach cannot have more than 10 specialties', 
        'VALIDATION_ERROR', 
        { specialties }
      );
    }

    specialties.forEach(specialty => {
      if (specialty.length < 2) {
        throw new BaseException(
          'Each specialty must be at least 2 characters long',
          'VALIDATION_ERROR',
          { specialty }
        );
      }
    });
  }

  private validateHourlyRate(rate: number): void {
    if (rate < 0) {
      throw new BaseException(
        'Hourly rate cannot be negative',
        'VALIDATION_ERROR',
        { rate }
      );
    }

    if (rate > 1000) {
      throw new BaseException(
        'Hourly rate cannot exceed $1000',
        'VALIDATION_ERROR',
        { rate }
      );
    }
  }

  // Method to add custom rules dynamically
  public addRule(field: string, rule: ValidationRule): void {
    if (!this.rules.has(field)) {
      this.rules.set(field, []);
    }
    this.rules.get(field)!.push(rule);
  }
}

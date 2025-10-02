import { CoachValidator, RequiredRule, MinLengthRule } from '@/validators/CoachValidator';
import { CoachDTO } from '@/dto/CoachDTO';

// Basic usage
const validator = new CoachValidator();
const coachData: CoachDTO = await getCoachFromAPI();

try {
  validator.validate(coachData);
  console.log('Coach data is valid');
} catch (error) {
  console.error('Validation failed:', error.message);
}

// Adding custom rules
validator.addRule('bio', new MinLengthRule(10));

// Creating custom validator
export class AvailabilityValidator implements ValidationRule {
  validate(value: boolean, field: string): void {
    if (value === undefined) {
      throw new BaseException(`${field} must be defined`, 'VALIDATION_ERROR', { field });
    }
  }
  
  getMessage(field: string): string {
    return `${field} must be a boolean value`;
  }
}

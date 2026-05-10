import type { ValidationFailureReason } from '../enums/ValidationFailureReason.js'
import { ValidationFailure } from './ValidationFailure.js'

export class ValidationResult {
  constructor(
    public readonly isValid: boolean,
    public readonly failures: ValidationFailure[] = [],
  ) {}

  static pass(): ValidationResult {
    return new ValidationResult(true)
  }

  static fail(failures: ValidationFailure[]): ValidationResult {
    return new ValidationResult(false, failures)
  }

  static failWithReason(
    reason: ValidationFailureReason,
    message: string,
  ): ValidationResult {
    return new ValidationResult(false, [new ValidationFailure(reason, message)])
  }

  isFailed(): boolean {
    return !this.isValid
  }

  getFailures(): ValidationFailure[] {
    return this.failures
  }

  getFirstFailure(): ValidationFailure | null {
    return this.failures[0] ?? null
  }

  hasFailureReason(reason: ValidationFailureReason): boolean {
    return this.failures.some((f) => f.reason === reason)
  }
}

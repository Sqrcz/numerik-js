import { ValidationFailureReason } from '../enums/ValidationFailureReason.js'
import { InvalidChecksumException } from '../exceptions/InvalidChecksumException.js'
import { InvalidDateException } from '../exceptions/InvalidDateException.js'
import { InvalidFormatException } from '../exceptions/InvalidFormatException.js'
import type { ValidationException } from '../exceptions/ValidationException.js'
import { ValidationFailure } from './ValidationFailure.js'

export class ValidationResult {
  public readonly isValid: boolean
  public readonly failures: readonly ValidationFailure[]

  constructor(isValid: boolean, failures: ValidationFailure[] = []) {
    this.isValid = isValid
    this.failures = [...failures]
  }

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

  getFailures(): readonly ValidationFailure[] {
    return this.failures
  }

  getFirstFailure(): ValidationFailure | null {
    return this.failures[0] ?? null
  }

  hasFailureReason(reason: ValidationFailureReason): boolean {
    return this.failures.some((f) => f.reason === reason)
  }

  toException(): ValidationException {
    switch (this.getFirstFailure()?.reason) {
      case ValidationFailureReason.InvalidChecksum:
        return new InvalidChecksumException(this)
      case ValidationFailureReason.InvalidDate:
      case ValidationFailureReason.FutureDate:
      case ValidationFailureReason.InvalidMonth:
        return new InvalidDateException(this)
      default:
        return new InvalidFormatException(this)
    }
  }
}

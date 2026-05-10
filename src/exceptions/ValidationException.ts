import type { ValidationResult } from '../result/ValidationResult.js'

export class ValidationException extends Error {
  constructor(public readonly result: ValidationResult) {
    super(result.getFirstFailure()?.message ?? 'Validation failed')
    this.name = 'ValidationException'
  }
}

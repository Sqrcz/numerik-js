import type { ValidationResult } from '../result/ValidationResult.js'
import { ValidationException } from './ValidationException.js'

export class InvalidDateException extends ValidationException {
  constructor(result: ValidationResult) {
    super(result)
    this.name = 'InvalidDateException'
  }
}

import type { ValidationResult } from '../result/ValidationResult.js'
import { ValidationException } from './ValidationException.js'

export class InvalidFormatException extends ValidationException {
  constructor(result: ValidationResult) {
    super(result)
    this.name = 'InvalidFormatException'
  }
}

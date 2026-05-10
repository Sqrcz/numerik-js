import type { ValidationResult } from '../result/ValidationResult.js'

export interface ValidatorInterface {
  validate(input: string): ValidationResult
  isValid(input: string): boolean
  isStrict(): boolean
}

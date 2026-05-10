import type { ParserInterface } from '../contracts/ParserInterface.js'
import type { ValidatorInterface } from '../contracts/ValidatorInterface.js'
import { ValidationFailureReason } from '../enums/ValidationFailureReason.js'
import { ValidationException } from '../exceptions/ValidationException.js'
import { ValidationResult } from '../result/ValidationResult.js'
import { Passport } from '../value-objects/Passport.js'

const WEIGHTS = [7, 3, 1, 7, 3, 1, 7, 3] as const
const MAX_LENGTH = 32
const LENGTH = 9

export class PassportIdentifier implements ValidatorInterface, ParserInterface {
  constructor(private readonly strict: boolean = true) {}

  isStrict(): boolean {
    return this.strict
  }

  validate(input: string): ValidationResult {
    if (input.length > MAX_LENGTH) {
      return ValidationResult.failWithReason(
        ValidationFailureReason.InvalidLength,
        'Input exceeds maximum length of 32 characters.',
      )
    }

    const normalized = this.normalize(input)

    if (normalized.length !== LENGTH) {
      return ValidationResult.failWithReason(
        ValidationFailureReason.InvalidLength,
        'Passport number must be exactly 9 characters.',
      )
    }

    if (!/^[A-Za-z]{2}/.test(normalized)) {
      return ValidationResult.failWithReason(
        ValidationFailureReason.InvalidCharacters,
        'Passport series (first 2 characters) must contain only letters.',
      )
    }

    if (!/^\d{7}$/.test(normalized.slice(2))) {
      return ValidationResult.failWithReason(
        ValidationFailureReason.InvalidCharacters,
        'Passport number portion (characters 3–9) must contain only digits.',
      )
    }

    if (!this.isValidChecksum(normalized)) {
      return ValidationResult.failWithReason(
        ValidationFailureReason.InvalidChecksum,
        'Passport checksum digit does not match.',
      )
    }

    return ValidationResult.pass()
  }

  isValid(input: string): boolean {
    return this.validate(input).isValid
  }

  parse(input: string): Passport {
    const result = this.validate(input)

    if (result.isFailed()) {
      throw new ValidationException(result)
    }

    return new Passport(input, this.normalize(input))
  }

  tryParse(input: string): Passport | null {
    try {
      return this.parse(input)
    } catch (err) {
      if (err instanceof ValidationException) return null
      throw err
    }
  }

  private normalize(input: string): string {
    return input.replace(/[-\s]/g, '').toUpperCase()
  }

  private icaoCharValue(char: string): number {
    const code = char.charCodeAt(0)
    return code >= 48 && code <= 57 ? code - 48 : code - 55
  }

  private isValidChecksum(normalized: string): boolean {
    let sum = 0
    for (let i = 0; i < 8; i++) {
      sum += this.icaoCharValue(normalized[i] ?? '') * (WEIGHTS[i] ?? 0)
    }
    return sum % 10 === Number(normalized[8])
  }
}

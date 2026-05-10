import type { ParserInterface } from '../contracts/ParserInterface.js'
import type { ValidatorInterface } from '../contracts/ValidatorInterface.js'
import { ValidationFailureReason } from '../enums/ValidationFailureReason.js'
import { ValidationException } from '../exceptions/ValidationException.js'
import { ValidationResult } from '../result/ValidationResult.js'
import { Nip } from '../value-objects/Nip.js'

const WEIGHTS = [6, 5, 7, 2, 3, 4, 5, 6, 7] as const
const MAX_LENGTH = 32
const DIGITS = 10

export class NipIdentifier implements ValidatorInterface, ParserInterface {
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

    if (normalized.length !== DIGITS) {
      return ValidationResult.failWithReason(
        ValidationFailureReason.InvalidLength,
        'NIP must be exactly 10 digits.',
      )
    }

    if (!/^\d+$/.test(normalized)) {
      return ValidationResult.failWithReason(
        ValidationFailureReason.InvalidCharacters,
        'NIP must contain only digits, hyphens, and spaces.',
      )
    }

    if (normalized.startsWith('000')) {
      return ValidationResult.failWithReason(
        ValidationFailureReason.InvalidFormat,
        'NIP tax office code cannot be 000.',
      )
    }

    const digits = Array.from(normalized).map(Number)
    const sum = digits
      .slice(0, 9)
      .reduce((acc, d, i) => acc + d * (WEIGHTS[i] ?? 0), 0)

    if (sum % 11 !== (digits[9] ?? -1)) {
      return ValidationResult.failWithReason(
        ValidationFailureReason.InvalidChecksum,
        'NIP checksum digit does not match.',
      )
    }

    if (this.strict && new Set(digits).size === 1) {
      return ValidationResult.failWithReason(
        ValidationFailureReason.AllSameDigit,
        'NIP consists of a single repeated digit.',
      )
    }

    return ValidationResult.pass()
  }

  isValid(input: string): boolean {
    return this.validate(input).isValid
  }

  parse(input: string): Nip {
    const result = this.validate(input)

    if (result.isFailed()) {
      throw new ValidationException(result)
    }

    return new Nip(input, this.normalize(input))
  }

  tryParse(input: string): Nip | null {
    try {
      return this.parse(input)
    } catch (err) {
      if (err instanceof ValidationException) return null
      throw err
    }
  }

  private normalize(input: string): string {
    return input.replace(/[-\s]/g, '')
  }
}

import type { ParserInterface } from '../contracts/ParserInterface.js'
import type { ValidatorInterface } from '../contracts/ValidatorInterface.js'
import { ValidationFailureReason } from '../enums/ValidationFailureReason.js'
import { ValidationException } from '../exceptions/ValidationException.js'
import { ValidationResult } from '../result/ValidationResult.js'
import { Krs } from '../value-objects/Krs.js'

const MAX_LENGTH = 32
const MAX_DIGITS = 10

export class KrsIdentifier implements ValidatorInterface, ParserInterface {
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

    if (normalized.length === 0 || normalized.length > MAX_DIGITS) {
      return ValidationResult.failWithReason(
        ValidationFailureReason.InvalidLength,
        'KRS must have between 1 and 10 digits.',
      )
    }

    if (!/^\d+$/.test(normalized)) {
      return ValidationResult.failWithReason(
        ValidationFailureReason.InvalidCharacters,
        'KRS must contain only digits and spaces.',
      )
    }

    if (Number(normalized) === 0) {
      return ValidationResult.failWithReason(
        ValidationFailureReason.AllZeros,
        'KRS cannot be all zeros.',
      )
    }

    const padded = normalized.padStart(MAX_DIGITS, '0')

    if (this.strict && new Set(padded).size === 1) {
      return ValidationResult.failWithReason(
        ValidationFailureReason.AllSameDigit,
        'KRS consists of a single repeated digit.',
      )
    }

    return ValidationResult.pass()
  }

  isValid(input: string): boolean {
    return this.validate(input).isValid
  }

  parse(input: string): Krs {
    const result = this.validate(input)

    if (result.isFailed()) {
      throw result.toException()
    }

    return new Krs(input, this.normalize(input))
  }

  tryParse(input: string): Krs | null {
    try {
      return this.parse(input)
    } catch (err) {
      if (err instanceof ValidationException) return null
      throw err
    }
  }

  private normalize(input: string): string {
    return input.replace(/ /g, '')
  }
}

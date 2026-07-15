import type { ParserInterface } from '../contracts/ParserInterface.js'
import type { ValidatorInterface } from '../contracts/ValidatorInterface.js'
import { RegonType } from '../enums/RegonType.js'
import { ValidationFailureReason } from '../enums/ValidationFailureReason.js'
import { ValidationException } from '../exceptions/ValidationException.js'
import { ValidationResult } from '../result/ValidationResult.js'
import { Regon } from '../value-objects/Regon.js'

const WEIGHTS_9 = [8, 9, 2, 3, 4, 5, 6, 7] as const
const WEIGHTS_14 = [2, 4, 8, 5, 0, 9, 7, 3, 6, 1, 2, 4, 8] as const
const MAX_LENGTH = 32
const DIGITS_9 = 9
const DIGITS_14 = 14

export class RegonIdentifier implements ValidatorInterface, ParserInterface {
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
    const length = normalized.length

    if (length !== DIGITS_9 && length !== DIGITS_14) {
      return ValidationResult.failWithReason(
        ValidationFailureReason.InvalidLength,
        'REGON must be exactly 9 or 14 digits.',
      )
    }

    if (!/^\d+$/.test(normalized)) {
      return ValidationResult.failWithReason(
        ValidationFailureReason.InvalidCharacters,
        'REGON must contain only digits and spaces.',
      )
    }

    const digits = Array.from(normalized).map(Number)

    if (!this.isValid9DigitChecksum(digits)) {
      return ValidationResult.failWithReason(
        ValidationFailureReason.InvalidChecksum,
        'REGON checksum digit does not match.',
      )
    }

    if (length === DIGITS_14 && !this.isValid14DigitChecksum(digits)) {
      return ValidationResult.failWithReason(
        ValidationFailureReason.InvalidChecksum,
        'REGON local unit checksum digit does not match.',
      )
    }

    return ValidationResult.pass()
  }

  isValid(input: string): boolean {
    return this.validate(input).isValid
  }

  parse(input: string): Regon {
    const result = this.validate(input)

    if (result.isFailed()) {
      throw result.toException()
    }

    const normalized = this.normalize(input)
    const type =
      normalized.length === DIGITS_9
        ? RegonType.Individual
        : RegonType.LegalEntity

    return new Regon(input, normalized, type)
  }

  tryParse(input: string): Regon | null {
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

  private isValid9DigitChecksum(digits: number[]): boolean {
    let sum = 0
    for (let i = 0; i < 8; i++) {
      sum += (digits[i] ?? 0) * (WEIGHTS_9[i] ?? 0)
    }
    const checksum = sum % 11
    return (checksum === 10 ? 0 : checksum) === (digits[8] ?? -1)
  }

  private isValid14DigitChecksum(digits: number[]): boolean {
    let sum = 0
    for (let i = 0; i < 13; i++) {
      sum += (digits[i] ?? 0) * (WEIGHTS_14[i] ?? 0)
    }
    const checksum = sum % 11
    return (checksum === 10 ? 0 : checksum) === (digits[13] ?? -1)
  }
}

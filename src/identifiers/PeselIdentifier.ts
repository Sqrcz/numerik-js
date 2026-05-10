import type { ParserInterface } from '../contracts/ParserInterface.js'
import type { ValidatorInterface } from '../contracts/ValidatorInterface.js'
import { Gender } from '../enums/Gender.js'
import { ValidationFailureReason } from '../enums/ValidationFailureReason.js'
import { ValidationException } from '../exceptions/ValidationException.js'
import { ValidationResult } from '../result/ValidationResult.js'
import { Pesel } from '../value-objects/Pesel.js'

const WEIGHTS = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3] as const
const MAX_LENGTH = 32
const DIGITS = 11

export class PeselIdentifier implements ValidatorInterface, ParserInterface {
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
        'PESEL must be exactly 11 digits.',
      )
    }

    if (!/^\d+$/.test(normalized)) {
      return ValidationResult.failWithReason(
        ValidationFailureReason.InvalidCharacters,
        'PESEL must contain only digits.',
      )
    }

    const digits = Array.from(normalized).map(Number)
    const encodedMonth = (digits[2] ?? 0) * 10 + (digits[3] ?? 0)
    const month = this.decodeMonth(encodedMonth)

    if (month === null) {
      return ValidationResult.failWithReason(
        ValidationFailureReason.InvalidMonth,
        'PESEL contains an invalid month encoding.',
      )
    }

    const year = this.decodeYear(
      (digits[0] ?? 0) * 10 + (digits[1] ?? 0),
      encodedMonth,
    )
    const day = (digits[4] ?? 0) * 10 + (digits[5] ?? 0)

    if (!this.isValidDate(year, month, day)) {
      return ValidationResult.failWithReason(
        ValidationFailureReason.InvalidDate,
        'PESEL contains an invalid date.',
      )
    }

    const sum = digits
      .slice(0, 10)
      .reduce((acc, d, i) => acc + d * (WEIGHTS[i] ?? 0), 0)

    if ((10 - (sum % 10)) % 10 !== (digits[10] ?? -1)) {
      return ValidationResult.failWithReason(
        ValidationFailureReason.InvalidChecksum,
        'PESEL checksum digit does not match.',
      )
    }

    if (this.strict) {
      const birthDate = new Date(year, month - 1, day)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (birthDate > today) {
        return ValidationResult.failWithReason(
          ValidationFailureReason.FutureDate,
          'PESEL birth date is in the future.',
        )
      }

      if (new Set(digits).size === 1) {
        return ValidationResult.failWithReason(
          ValidationFailureReason.AllSameDigit,
          'PESEL consists of a single repeated digit.',
        )
      }
    }

    return ValidationResult.pass()
  }

  isValid(input: string): boolean {
    return this.validate(input).isValid
  }

  parse(input: string): Pesel {
    const result = this.validate(input)

    if (result.isFailed()) {
      throw new ValidationException(result)
    }

    const normalized = this.normalize(input)
    const digits = Array.from(normalized).map(Number)
    const encodedMonth = (digits[2] ?? 0) * 10 + (digits[3] ?? 0)
    const month = this.decodeMonth(encodedMonth) ?? 1
    const year = this.decodeYear(
      (digits[0] ?? 0) * 10 + (digits[1] ?? 0),
      encodedMonth,
    )
    const day = (digits[4] ?? 0) * 10 + (digits[5] ?? 0)
    const birthDate = new Date(year, month - 1, day)
    const gender = (digits[9] ?? 0) % 2 === 1 ? Gender.Male : Gender.Female
    const ordinalNumber =
      (digits[6] ?? 0) * 1000 +
      (digits[7] ?? 0) * 100 +
      (digits[8] ?? 0) * 10 +
      (digits[9] ?? 0)

    return new Pesel(input, normalized, birthDate, gender, ordinalNumber)
  }

  tryParse(input: string): Pesel | null {
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

  private decodeMonth(encodedMonth: number): number | null {
    if (encodedMonth >= 1 && encodedMonth <= 12) return encodedMonth
    if (encodedMonth >= 21 && encodedMonth <= 32) return encodedMonth - 20
    if (encodedMonth >= 41 && encodedMonth <= 52) return encodedMonth - 40
    if (encodedMonth >= 61 && encodedMonth <= 72) return encodedMonth - 60
    if (encodedMonth >= 81 && encodedMonth <= 92) return encodedMonth - 80
    return null
  }

  private decodeYear(yy: number, encodedMonth: number): number {
    if (encodedMonth >= 81 && encodedMonth <= 92) return 1800 + yy
    if (encodedMonth >= 1 && encodedMonth <= 12) return 1900 + yy
    if (encodedMonth >= 21 && encodedMonth <= 32) return 2000 + yy
    if (encodedMonth >= 41 && encodedMonth <= 52) return 2100 + yy
    return 2200 + yy
  }

  private isValidDate(year: number, month: number, day: number): boolean {
    const d = new Date(year, month - 1, day)
    return (
      d.getFullYear() === year &&
      d.getMonth() === month - 1 &&
      d.getDate() === day
    )
  }
}

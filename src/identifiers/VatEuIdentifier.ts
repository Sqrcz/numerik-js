import type { ParserInterface } from '../contracts/ParserInterface.js'
import type { ValidatorInterface } from '../contracts/ValidatorInterface.js'
import { ValidationFailureReason } from '../enums/ValidationFailureReason.js'
import { ValidationException } from '../exceptions/ValidationException.js'
import { ValidationResult } from '../result/ValidationResult.js'
import { VatEu } from '../value-objects/VatEu.js'
import { NipIdentifier } from './NipIdentifier.js'

const MAX_LENGTH = 32
const NIP_DIGITS = 10
const PREFIX = 'PL'

export class VatEuIdentifier implements ValidatorInterface, ParserInterface {
  private readonly nip: NipIdentifier

  constructor(private readonly strict: boolean = true) {
    this.nip = new NipIdentifier(strict)
  }

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

    const stripped = this.stripSeparators(input)

    if (stripped.length < 2 || stripped.slice(0, 2).toUpperCase() !== PREFIX) {
      return ValidationResult.failWithReason(
        ValidationFailureReason.InvalidFormat,
        'VAT-EU number must start with the PL country prefix.',
      )
    }

    const nipPart = stripped.slice(2)

    if (nipPart.length !== NIP_DIGITS) {
      return ValidationResult.failWithReason(
        ValidationFailureReason.InvalidLength,
        'VAT-EU must contain exactly 10 digits after the PL prefix.',
      )
    }

    return this.nip.validate(nipPart)
  }

  isValid(input: string): boolean {
    return this.validate(input).isValid
  }

  parse(input: string): VatEu {
    const result = this.validate(input)

    if (result.isFailed()) {
      throw result.toException()
    }

    return new VatEu(input, this.normalize(input))
  }

  tryParse(input: string): VatEu | null {
    try {
      return this.parse(input)
    } catch (err) {
      if (err instanceof ValidationException) return null
      throw err
    }
  }

  private stripSeparators(input: string): string {
    return input.replace(/[-\s]/g, '')
  }

  private normalize(input: string): string {
    const stripped = this.stripSeparators(input)
    return PREFIX + stripped.slice(2)
  }
}

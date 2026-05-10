import type { ParserInterface } from '../contracts/ParserInterface.js'
import type { ValidatorInterface } from '../contracts/ValidatorInterface.js'
import { ValidationFailureReason } from '../enums/ValidationFailureReason.js'
import { ValidationException } from '../exceptions/ValidationException.js'
import { ValidationResult } from '../result/ValidationResult.js'
import { Iban } from '../value-objects/Iban.js'
import { NrbIdentifier } from './NrbIdentifier.js'

const MAX_LENGTH = 40
const NRB_DIGITS = 26

export class IbanIdentifier implements ValidatorInterface, ParserInterface {
  private readonly nrb: NrbIdentifier

  constructor(private readonly strict: boolean = true) {
    this.nrb = new NrbIdentifier(strict)
  }

  isStrict(): boolean {
    return this.strict
  }

  validate(input: string): ValidationResult {
    if (input.length > MAX_LENGTH) {
      return ValidationResult.failWithReason(
        ValidationFailureReason.InvalidLength,
        'Input exceeds maximum length of 40 characters.',
      )
    }

    const stripped = this.stripSeparators(input)

    if (stripped.length < 2 || stripped.slice(0, 2).toUpperCase() !== 'PL') {
      return ValidationResult.failWithReason(
        ValidationFailureReason.InvalidFormat,
        'IBAN must start with the PL country prefix.',
      )
    }

    const nrbPart = stripped.slice(2)

    if (nrbPart.length !== NRB_DIGITS) {
      return ValidationResult.failWithReason(
        ValidationFailureReason.InvalidLength,
        'IBAN must contain exactly 26 digits after the PL prefix.',
      )
    }

    return this.nrb.validate(nrbPart)
  }

  isValid(input: string): boolean {
    return this.validate(input).isValid
  }

  parse(input: string): Iban {
    const result = this.validate(input)

    if (result.isFailed()) {
      throw new ValidationException(result)
    }

    return new Iban(input, this.normalize(input))
  }

  tryParse(input: string): Iban | null {
    try {
      return this.parse(input)
    } catch (err) {
      if (err instanceof ValidationException) return null
      throw err
    }
  }

  private stripSeparators(input: string): string {
    return input.replace(/[ -]/g, '')
  }

  private normalize(input: string): string {
    const stripped = this.stripSeparators(input)
    return `PL${stripped.slice(2)}`
  }
}

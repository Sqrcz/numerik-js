import type { ParserInterface } from '../contracts/ParserInterface.js'
import type { ValidatorInterface } from '../contracts/ValidatorInterface.js'
import { ValidationFailureReason } from '../enums/ValidationFailureReason.js'
import { ValidationException } from '../exceptions/ValidationException.js'
import { ValidationResult } from '../result/ValidationResult.js'
import { Nrb } from '../value-objects/Nrb.js'

const DIGITS = 26
const MAX_LENGTH = 40

export class NrbIdentifier implements ValidatorInterface, ParserInterface {
  constructor(private readonly strict: boolean = true) {}

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

    const normalized = this.normalize(input)

    if (normalized.length !== DIGITS) {
      return ValidationResult.failWithReason(
        ValidationFailureReason.InvalidLength,
        'NRB must be exactly 26 digits.',
      )
    }

    if (!/^\d+$/.test(normalized)) {
      return ValidationResult.failWithReason(
        ValidationFailureReason.InvalidCharacters,
        'NRB must contain only digits.',
      )
    }

    if (!this.isValidChecksum(normalized)) {
      return ValidationResult.failWithReason(
        ValidationFailureReason.InvalidChecksum,
        'NRB checksum (MOD-97) does not match.',
      )
    }

    return ValidationResult.pass()
  }

  isValid(input: string): boolean {
    return this.validate(input).isValid
  }

  parse(input: string): Nrb {
    const result = this.validate(input)

    if (result.isFailed()) {
      throw new ValidationException(result)
    }

    return new Nrb(input, this.normalize(input))
  }

  tryParse(input: string): Nrb | null {
    try {
      return this.parse(input)
    } catch (err) {
      if (err instanceof ValidationException) return null
      throw err
    }
  }

  private normalize(input: string): string {
    const stripped = input.replace(/[ -]/g, '')
    return stripped.toUpperCase().startsWith('PL')
      ? stripped.slice(2)
      : stripped
  }

  private isValidChecksum(normalized: string): boolean {
    const rearranged = `${normalized.slice(2)}2521${normalized.slice(0, 2)}`
    let remainder = 0
    for (const ch of rearranged) {
      remainder = (remainder * 10 + Number(ch)) % 97
    }
    return remainder === 1
  }
}

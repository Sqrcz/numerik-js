import type { IdentifierInterface } from '../contracts/IdentifierInterface.js'

export class Passport implements IdentifierInterface {
  constructor(
    private readonly raw: string,
    private readonly normalized: string,
  ) {}

  getRaw(): string {
    return this.raw
  }

  getNormalized(): string {
    return this.normalized
  }

  toString(): string {
    return this.normalized
  }

  getSeries(): string {
    return this.normalized.slice(0, 2)
  }

  getSequentialNumber(): string {
    return this.normalized.slice(2, 8)
  }

  getCheckDigit(): string {
    return this.normalized.slice(8, 9)
  }
}

import type { IdentifierInterface } from '../contracts/IdentifierInterface.js'

export class Krs implements IdentifierInterface {
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

  getFormatted(): string {
    return this.normalized.padStart(10, '0')
  }

  getNumericValue(): number {
    return Number(this.normalized)
  }
}

import type { IdentifierInterface } from '../contracts/IdentifierInterface.js'

export class VatEu implements IdentifierInterface {
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

  getCountryCode(): string {
    return 'PL'
  }

  getNip(): string {
    return this.normalized.slice(2)
  }

  getFormatted(): string {
    const n = this.getNip()
    return `PL${n.slice(0, 3)}-${n.slice(3, 6)}-${n.slice(6, 8)}-${n.slice(8, 10)}`
  }
}

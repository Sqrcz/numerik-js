import type { IdentifierInterface } from '../contracts/IdentifierInterface.js'

export class Nip implements IdentifierInterface {
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
    const n = this.normalized
    return `${n.slice(0, 3)}-${n.slice(3, 6)}-${n.slice(6, 8)}-${n.slice(8, 10)}`
  }

  getFormattedAlternative(): string {
    const n = this.normalized
    return `${n.slice(0, 3)}-${n.slice(3, 5)}-${n.slice(5, 7)}-${n.slice(7, 10)}`
  }

  getTaxOfficeCode(): string {
    return this.normalized.slice(0, 3)
  }
}

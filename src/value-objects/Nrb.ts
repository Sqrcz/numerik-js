import type { IdentifierInterface } from '../contracts/IdentifierInterface.js'

export class Nrb implements IdentifierInterface {
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
    const rest = this.normalized.slice(2)
    const grouped = rest.match(/.{1,4}/g)?.join(' ') ?? rest
    return `${this.normalized.slice(0, 2)} ${grouped}`
  }

  getIban(): string {
    return `PL${this.normalized}`
  }

  getFormattedIban(): string {
    const full = `PL${this.normalized}`
    return full.match(/.{1,4}/g)?.join(' ') ?? full
  }

  getCheckDigits(): string {
    return this.normalized.slice(0, 2)
  }

  getSortCode(): string {
    return this.normalized.slice(2, 10)
  }

  getBankCode(): string {
    return this.normalized.slice(2, 5)
  }

  getAccountNumber(): string {
    return this.normalized.slice(10, 26)
  }
}

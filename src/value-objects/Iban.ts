import type { IdentifierInterface } from '../contracts/IdentifierInterface.js'

export class Iban implements IdentifierInterface {
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
    return this.normalized.match(/.{1,4}/g)?.join(' ') ?? this.normalized
  }

  getCountryCode(): string {
    return 'PL'
  }

  getNrb(): string {
    return this.normalized.slice(2)
  }

  getCheckDigits(): string {
    return this.normalized.slice(2, 4)
  }

  getSortCode(): string {
    return this.normalized.slice(4, 12)
  }

  getBankCode(): string {
    return this.normalized.slice(4, 7)
  }

  getAccountNumber(): string {
    return this.normalized.slice(12, 28)
  }
}

import type { IdentifierInterface } from '../contracts/IdentifierInterface.js'
import { RegonType } from '../enums/RegonType.js'

export class Regon implements IdentifierInterface {
  constructor(
    private readonly raw: string,
    private readonly normalized: string,
    private readonly type: RegonType,
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

  getType(): RegonType {
    return this.type
  }

  getBaseRegon(): string {
    return this.normalized.slice(0, 9)
  }

  getLocalUnitSuffix(): string | null {
    if (this.type === RegonType.Individual) return null
    return this.normalized.slice(9, 14)
  }

  isLocalUnit(): boolean {
    return this.type === RegonType.LegalEntity
  }
}

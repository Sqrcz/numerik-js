import { IbanIdentifier } from './identifiers/IbanIdentifier.js'
import { IdCardIdentifier } from './identifiers/IdCardIdentifier.js'
import { KrsIdentifier } from './identifiers/KrsIdentifier.js'
import { NipIdentifier } from './identifiers/NipIdentifier.js'
import { NrbIdentifier } from './identifiers/NrbIdentifier.js'
import { PassportIdentifier } from './identifiers/PassportIdentifier.js'
import { PeselIdentifier } from './identifiers/PeselIdentifier.js'
import { RegonIdentifier } from './identifiers/RegonIdentifier.js'
import { VatEuIdentifier } from './identifiers/VatEuIdentifier.js'

export const Numerik = {
  // Personal
  pesel: (strict = true) => new PeselIdentifier(strict),
  idCard: (strict = true) => new IdCardIdentifier(strict),
  passport: (strict = true) => new PassportIdentifier(strict),

  // Tax & Business
  nip: (strict = true) => new NipIdentifier(strict),
  vatEu: (strict = true) => new VatEuIdentifier(strict),
  regon: (strict = true) => new RegonIdentifier(strict),
  krs: (strict = true) => new KrsIdentifier(strict),

  // Banking
  nrb: (strict = true) => new NrbIdentifier(strict),
  iban: (strict = true) => new IbanIdentifier(strict),
} as const

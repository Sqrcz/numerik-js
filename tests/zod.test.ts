import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { Gender } from '../src/enums/Gender.js'
import { RegonType } from '../src/enums/RegonType.js'
import { Iban } from '../src/value-objects/Iban.js'
import { IdCard } from '../src/value-objects/IdCard.js'
import { Krs } from '../src/value-objects/Krs.js'
import { Nip } from '../src/value-objects/Nip.js'
import { Nrb } from '../src/value-objects/Nrb.js'
import { Passport } from '../src/value-objects/Passport.js'
import { Pesel } from '../src/value-objects/Pesel.js'
import { Regon } from '../src/value-objects/Regon.js'
import { VatEu } from '../src/value-objects/VatEu.js'
import {
  ibanParseSchema,
  ibanSchema,
  idCardParseSchema,
  idCardSchema,
  krsParseSchema,
  krsSchema,
  nipParseSchema,
  nipSchema,
  nrbParseSchema,
  nrbSchema,
  passportParseSchema,
  passportSchema,
  peselParseSchema,
  peselSchema,
  regonParseSchema,
  regonSchema,
  vatEuParseSchema,
  vatEuSchema,
} from '../src/zod/index.js'

// ---------------------------------------------------------------------------
// PESEL
// ---------------------------------------------------------------------------

describe('peselSchema', () => {
  it('passes for a valid PESEL', () => {
    expect(peselSchema().safeParse('92060512186').success).toBe(true)
  })

  it('fails for an invalid PESEL with a descriptive error', () => {
    const result = peselSchema().safeParse('92060512185')
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain('checksum')
    }
  })

  it('respects strict=false (allows spaces)', () => {
    expect(peselSchema(false).safeParse('92060 512186').success).toBe(true)
  })

  it('rejects future-date PESEL in strict mode', () => {
    expect(peselSchema(true).safeParse('92060512185').success).toBe(false)
  })
})

describe('peselParseSchema', () => {
  it('transforms to a Pesel value object', () => {
    const result = peselParseSchema().safeParse('92060512186')
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toBeInstanceOf(Pesel)
      expect(result.data.getGender()).toBe(Gender.Female)
      expect(result.data.getNormalized()).toBe('92060512186')
    }
  })

  it('fails for an invalid PESEL', () => {
    expect(peselParseSchema().safeParse('00000000000').success).toBe(false)
  })

  it('works inside a z.object schema', () => {
    const schema = z.object({ pesel: peselParseSchema() })
    const result = schema.safeParse({ pesel: '92060512186' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.pesel).toBeInstanceOf(Pesel)
    }
  })
})

// ---------------------------------------------------------------------------
// ID Card
// ---------------------------------------------------------------------------

describe('idCardSchema', () => {
  it('passes for a valid ID card number', () => {
    expect(idCardSchema().safeParse('ABC123454').success).toBe(true)
  })

  it('fails for an invalid ID card number', () => {
    expect(idCardSchema().safeParse('ABC123453').success).toBe(false)
  })
})

describe('idCardParseSchema', () => {
  it('transforms to an IdCard value object', () => {
    const result = idCardParseSchema().safeParse('ABC123454')
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toBeInstanceOf(IdCard)
      expect(result.data.getSeries()).toBe('ABC')
    }
  })
})

// ---------------------------------------------------------------------------
// Passport
// ---------------------------------------------------------------------------

describe('passportSchema', () => {
  it('passes for a valid passport number', () => {
    expect(passportSchema().safeParse('AB1234564').success).toBe(true)
  })

  it('fails for an invalid passport number', () => {
    expect(passportSchema().safeParse('AB1234563').success).toBe(false)
  })
})

describe('passportParseSchema', () => {
  it('transforms to a Passport value object', () => {
    const result = passportParseSchema().safeParse('AB1234564')
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toBeInstanceOf(Passport)
      expect(result.data.getSeries()).toBe('AB')
    }
  })
})

// ---------------------------------------------------------------------------
// NIP
// ---------------------------------------------------------------------------

describe('nipSchema', () => {
  it('passes for a valid NIP', () => {
    expect(nipSchema().safeParse('5260250274').success).toBe(true)
  })

  it('fails for an invalid NIP', () => {
    expect(nipSchema().safeParse('5260250275').success).toBe(false)
  })

  it('accepts dashes in non-strict mode', () => {
    expect(nipSchema(false).safeParse('526-025-02-74').success).toBe(true)
  })
})

describe('nipParseSchema', () => {
  it('transforms to a Nip value object', () => {
    const result = nipParseSchema().safeParse('5260250274')
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toBeInstanceOf(Nip)
      expect(result.data.getFormatted()).toBe('526-025-02-74')
    }
  })
})

// ---------------------------------------------------------------------------
// VAT-EU
// ---------------------------------------------------------------------------

describe('vatEuSchema', () => {
  it('passes for a valid VAT-EU number', () => {
    expect(vatEuSchema().safeParse('PL5260250274').success).toBe(true)
  })

  it('fails for a non-PL VAT-EU number', () => {
    expect(vatEuSchema().safeParse('DE123456789').success).toBe(false)
  })
})

describe('vatEuParseSchema', () => {
  it('transforms to a VatEu value object', () => {
    const result = vatEuParseSchema().safeParse('PL5260250274')
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toBeInstanceOf(VatEu)
      expect(result.data.getCountryCode()).toBe('PL')
      expect(result.data.getNip()).toBe('5260250274')
    }
  })
})

// ---------------------------------------------------------------------------
// REGON
// ---------------------------------------------------------------------------

describe('regonSchema', () => {
  it('passes for a valid 9-digit REGON', () => {
    expect(regonSchema().safeParse('123456785').success).toBe(true)
  })

  it('fails for an invalid REGON', () => {
    expect(regonSchema().safeParse('123456786').success).toBe(false)
  })
})

describe('regonParseSchema', () => {
  it('transforms to a Regon value object', () => {
    const result = regonParseSchema().safeParse('123456785')
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toBeInstanceOf(Regon)
      expect(result.data.getType()).toBe(RegonType.Individual)
    }
  })
})

// ---------------------------------------------------------------------------
// KRS
// ---------------------------------------------------------------------------

describe('krsSchema', () => {
  it('passes for a valid KRS number', () => {
    expect(krsSchema().safeParse('0000000001').success).toBe(true)
  })

  it('fails for a KRS of all zeros', () => {
    expect(krsSchema().safeParse('0000000000').success).toBe(false)
  })
})

describe('krsParseSchema', () => {
  it('transforms to a Krs value object', () => {
    const result = krsParseSchema().safeParse('0000000001')
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toBeInstanceOf(Krs)
      expect(result.data.getNumericValue()).toBe(1)
    }
  })
})

// ---------------------------------------------------------------------------
// NRB
// ---------------------------------------------------------------------------

describe('nrbSchema', () => {
  it('passes for a valid NRB', () => {
    expect(nrbSchema().safeParse('61109010140000071219812874').success).toBe(
      true,
    )
  })

  it('fails for an invalid NRB', () => {
    expect(nrbSchema().safeParse('61109010140000071219812875').success).toBe(
      false,
    )
  })
})

describe('nrbParseSchema', () => {
  it('transforms to a Nrb value object', () => {
    const result = nrbParseSchema().safeParse('61109010140000071219812874')
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toBeInstanceOf(Nrb)
      expect(result.data.getIban()).toBe('PL61109010140000071219812874')
    }
  })
})

// ---------------------------------------------------------------------------
// IBAN
// ---------------------------------------------------------------------------

describe('ibanSchema', () => {
  it('passes for a valid PL IBAN', () => {
    expect(ibanSchema().safeParse('PL61109010140000071219812874').success).toBe(
      true,
    )
  })

  it('fails for a non-PL IBAN', () => {
    expect(ibanSchema().safeParse('DE89370400440532013000').success).toBe(false)
  })
})

describe('ibanParseSchema', () => {
  it('transforms to an Iban value object', () => {
    const result = ibanParseSchema().safeParse('PL61109010140000071219812874')
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toBeInstanceOf(Iban)
      expect(result.data.getCountryCode()).toBe('PL')
      expect(result.data.getNrb()).toBe('61109010140000071219812874')
    }
  })
})

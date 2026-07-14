import { describe, expect, expectTypeOf, it } from 'vitest'
import type { z } from 'zod'
import { Gender } from '../src/enums/Gender.js'
import { RegonType } from '../src/enums/RegonType.js'
import { ValidationFailureReason } from '../src/enums/ValidationFailureReason.js'
import type { ValidationFailure } from '../src/result/ValidationFailure.js'
import type { ValidationResult } from '../src/result/ValidationResult.js'
import type { Iban } from '../src/value-objects/Iban.js'
import type { IdCard } from '../src/value-objects/IdCard.js'
import type { Krs } from '../src/value-objects/Krs.js'
import type { Nip } from '../src/value-objects/Nip.js'
import type { Nrb } from '../src/value-objects/Nrb.js'
import type { Passport } from '../src/value-objects/Passport.js'
import type { Pesel } from '../src/value-objects/Pesel.js'
import type { Regon } from '../src/value-objects/Regon.js'
import type { VatEu } from '../src/value-objects/VatEu.js'
import type {
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

describe('Pesel', () => {
  it('pins the value-object getter return types', () => {
    expectTypeOf<Pesel['getRaw']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Pesel['getNormalized']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Pesel['toString']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Pesel['getBirthDate']>().returns.toEqualTypeOf<Date>()
    expectTypeOf<Pesel['getGender']>().returns.toEqualTypeOf<Gender>()
    expectTypeOf<Pesel['getOrdinalNumber']>().returns.toEqualTypeOf<number>()
    expectTypeOf<Pesel['isMale']>().returns.toEqualTypeOf<boolean>()
    expectTypeOf<Pesel['isFemale']>().returns.toEqualTypeOf<boolean>()
    expectTypeOf<Pesel['getAge']>().returns.toEqualTypeOf<number>()
    expectTypeOf<Pesel['isAdult']>().returns.toEqualTypeOf<boolean>()
    expectTypeOf<Pesel['getCentury']>().returns.toEqualTypeOf<number>()
  })

  it('pins the zod schema output types', () => {
    expectTypeOf<
      z.infer<ReturnType<typeof peselSchema>>
    >().toEqualTypeOf<string>()
    expectTypeOf<
      z.infer<ReturnType<typeof peselParseSchema>>
    >().toEqualTypeOf<Pesel>()
  })
})

describe('IdCard', () => {
  it('pins the value-object getter return types', () => {
    expectTypeOf<IdCard['getRaw']>().returns.toEqualTypeOf<string>()
    expectTypeOf<IdCard['getNormalized']>().returns.toEqualTypeOf<string>()
    expectTypeOf<IdCard['toString']>().returns.toEqualTypeOf<string>()
    expectTypeOf<IdCard['getSeries']>().returns.toEqualTypeOf<string>()
    expectTypeOf<
      IdCard['getSequentialNumber']
    >().returns.toEqualTypeOf<string>()
    expectTypeOf<IdCard['getCheckDigit']>().returns.toEqualTypeOf<string>()
  })

  it('pins the zod schema output types', () => {
    expectTypeOf<
      z.infer<ReturnType<typeof idCardSchema>>
    >().toEqualTypeOf<string>()
    expectTypeOf<
      z.infer<ReturnType<typeof idCardParseSchema>>
    >().toEqualTypeOf<IdCard>()
  })
})

describe('Passport', () => {
  it('pins the value-object getter return types', () => {
    expectTypeOf<Passport['getRaw']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Passport['getNormalized']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Passport['toString']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Passport['getSeries']>().returns.toEqualTypeOf<string>()
    expectTypeOf<
      Passport['getSequentialNumber']
    >().returns.toEqualTypeOf<string>()
    expectTypeOf<Passport['getCheckDigit']>().returns.toEqualTypeOf<string>()
  })

  it('pins the zod schema output types', () => {
    expectTypeOf<
      z.infer<ReturnType<typeof passportSchema>>
    >().toEqualTypeOf<string>()
    expectTypeOf<
      z.infer<ReturnType<typeof passportParseSchema>>
    >().toEqualTypeOf<Passport>()
  })
})

describe('Nip', () => {
  it('pins the value-object getter return types', () => {
    expectTypeOf<Nip['getRaw']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Nip['getNormalized']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Nip['toString']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Nip['getFormatted']>().returns.toEqualTypeOf<string>()
    expectTypeOf<
      Nip['getFormattedAlternative']
    >().returns.toEqualTypeOf<string>()
    expectTypeOf<Nip['getTaxOfficeCode']>().returns.toEqualTypeOf<string>()
  })

  it('pins the zod schema output types', () => {
    expectTypeOf<
      z.infer<ReturnType<typeof nipSchema>>
    >().toEqualTypeOf<string>()
    expectTypeOf<
      z.infer<ReturnType<typeof nipParseSchema>>
    >().toEqualTypeOf<Nip>()
  })
})

describe('VatEu', () => {
  it('pins the value-object getter return types', () => {
    expectTypeOf<VatEu['getRaw']>().returns.toEqualTypeOf<string>()
    expectTypeOf<VatEu['getNormalized']>().returns.toEqualTypeOf<string>()
    expectTypeOf<VatEu['toString']>().returns.toEqualTypeOf<string>()
    expectTypeOf<VatEu['getCountryCode']>().returns.toEqualTypeOf<string>()
    expectTypeOf<VatEu['getNip']>().returns.toEqualTypeOf<string>()
    expectTypeOf<VatEu['getFormatted']>().returns.toEqualTypeOf<string>()
  })

  it('pins the zod schema output types', () => {
    expectTypeOf<
      z.infer<ReturnType<typeof vatEuSchema>>
    >().toEqualTypeOf<string>()
    expectTypeOf<
      z.infer<ReturnType<typeof vatEuParseSchema>>
    >().toEqualTypeOf<VatEu>()
  })
})

describe('Regon', () => {
  it('pins the value-object getter return types', () => {
    expectTypeOf<Regon['getRaw']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Regon['getNormalized']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Regon['toString']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Regon['getType']>().returns.toEqualTypeOf<RegonType>()
    expectTypeOf<Regon['getBaseRegon']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Regon['getLocalUnitSuffix']>().returns.toEqualTypeOf<
      string | null
    >()
    expectTypeOf<Regon['isLocalUnit']>().returns.toEqualTypeOf<boolean>()
  })

  it('pins the zod schema output types', () => {
    expectTypeOf<
      z.infer<ReturnType<typeof regonSchema>>
    >().toEqualTypeOf<string>()
    expectTypeOf<
      z.infer<ReturnType<typeof regonParseSchema>>
    >().toEqualTypeOf<Regon>()
  })
})

describe('Krs', () => {
  it('pins the value-object getter return types', () => {
    expectTypeOf<Krs['getRaw']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Krs['getNormalized']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Krs['toString']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Krs['getFormatted']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Krs['getNumericValue']>().returns.toEqualTypeOf<number>()
  })

  it('pins the zod schema output types', () => {
    expectTypeOf<
      z.infer<ReturnType<typeof krsSchema>>
    >().toEqualTypeOf<string>()
    expectTypeOf<
      z.infer<ReturnType<typeof krsParseSchema>>
    >().toEqualTypeOf<Krs>()
  })
})

describe('Nrb', () => {
  it('pins the value-object getter return types', () => {
    expectTypeOf<Nrb['getRaw']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Nrb['getNormalized']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Nrb['toString']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Nrb['getFormatted']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Nrb['getIban']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Nrb['getFormattedIban']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Nrb['getCheckDigits']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Nrb['getSortCode']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Nrb['getBankCode']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Nrb['getAccountNumber']>().returns.toEqualTypeOf<string>()
  })

  it('pins the zod schema output types', () => {
    expectTypeOf<
      z.infer<ReturnType<typeof nrbSchema>>
    >().toEqualTypeOf<string>()
    expectTypeOf<
      z.infer<ReturnType<typeof nrbParseSchema>>
    >().toEqualTypeOf<Nrb>()
  })
})

describe('Iban', () => {
  it('pins the value-object getter return types', () => {
    expectTypeOf<Iban['getRaw']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Iban['getNormalized']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Iban['toString']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Iban['getFormatted']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Iban['getCountryCode']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Iban['getNrb']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Iban['getCheckDigits']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Iban['getSortCode']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Iban['getBankCode']>().returns.toEqualTypeOf<string>()
    expectTypeOf<Iban['getAccountNumber']>().returns.toEqualTypeOf<string>()
  })

  it('pins the zod schema output types', () => {
    expectTypeOf<
      z.infer<ReturnType<typeof ibanSchema>>
    >().toEqualTypeOf<string>()
    expectTypeOf<
      z.infer<ReturnType<typeof ibanParseSchema>>
    >().toEqualTypeOf<Iban>()
  })
})

describe('shared types', () => {
  it('pins ValidationResult.failures to a ValidationFailure array', () => {
    expectTypeOf<ValidationResult['failures']>().toEqualTypeOf<
      readonly ValidationFailure[]
    >()
  })

  it('exports Gender as a runtime-usable value, not just a type', () => {
    expect(Gender.Male).toBe('male')
    expect(Gender.Female).toBe('female')
  })

  it('exports RegonType as a runtime-usable value, not just a type', () => {
    expect(RegonType.Individual).toBe('individual')
    expect(RegonType.LegalEntity).toBe('legal_entity')
  })

  it('exports ValidationFailureReason as a runtime-usable value, not just a type', () => {
    expect(ValidationFailureReason.InvalidChecksum).toBe('invalid_checksum')
  })
})

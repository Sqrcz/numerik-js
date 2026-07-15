import { describe, expect, it } from 'vitest'
import {
  Iban,
  IdCard,
  InvalidChecksumException,
  InvalidDateException,
  InvalidFormatException,
  Krs,
  Nip,
  Nrb,
  Numerik,
  Passport,
  Pesel,
  Regon,
  ValidationException,
  VatEu,
} from '../src/index.js'

const cases = [
  {
    key: 'pesel',
    sample: '44051401458',
    expectedInstance: Pesel,
    badChecksumSample: '44051401459',
  },
  {
    key: 'idCard',
    sample: 'ABC123454',
    expectedInstance: IdCard,
    badChecksumSample: 'ABC123453',
  },
  {
    key: 'passport',
    sample: 'AB1234564',
    expectedInstance: Passport,
    badChecksumSample: 'AB1234563',
  },
  {
    key: 'nip',
    sample: '5260250274',
    expectedInstance: Nip,
    badChecksumSample: '5260250275',
  },
  {
    key: 'vatEu',
    sample: 'PL5260250274',
    expectedInstance: VatEu,
    badChecksumSample: 'PL5260250275',
  },
  {
    key: 'regon',
    sample: '850518457',
    expectedInstance: Regon,
    badChecksumSample: '850518456',
  },
  {
    key: 'krs',
    sample: '0000127206',
    expectedInstance: Krs,
    badChecksumSample: null, // KRS has no checksum digit
  },
  {
    key: 'nrb',
    sample: '61102010260000000000000000',
    expectedInstance: Nrb,
    badChecksumSample: '62102010260000000000000000',
  },
  {
    key: 'iban',
    sample: 'PL61102010260000000000000000',
    expectedInstance: Iban,
    badChecksumSample: 'PL62102010260000000000000000',
  },
] as const

describe.each(cases)(
  'Numerik.$key()',
  ({ key, sample, expectedInstance, badChecksumSample }) => {
    it('validate() accepts a known-good value', () => {
      expect(Numerik[key]().validate(sample).isValid).toBe(true)
    })

    it('isValid() accepts a known-good value', () => {
      expect(Numerik[key]().isValid(sample)).toBe(true)
    })

    it('parse() returns the identifier value object', () => {
      expect(Numerik[key]().parse(sample)).toBeInstanceOf(expectedInstance)
    })

    it('tryParse() returns the identifier value object', () => {
      expect(Numerik[key]().tryParse(sample)).toBeInstanceOf(expectedInstance)
    })

    it.skipIf(badChecksumSample === null)(
      'parse() throws InvalidChecksumException, imported from the package root, for a bad checksum',
      () => {
        expect(() => Numerik[key]().parse(badChecksumSample as string)).toThrow(
          InvalidChecksumException,
        )
      },
    )
  },
)

describe('exception exports', () => {
  it('InvalidChecksumException, InvalidDateException, and InvalidFormatException are importable from the package root and extend ValidationException', () => {
    expect(
      new InvalidChecksumException(Numerik.pesel().validate('bad')),
    ).toBeInstanceOf(ValidationException)
    expect(
      new InvalidDateException(Numerik.pesel().validate('bad')),
    ).toBeInstanceOf(ValidationException)
    expect(
      new InvalidFormatException(Numerik.pesel().validate('bad')),
    ).toBeInstanceOf(ValidationException)
  })

  it('ValidationResult.toException(), reached via the public facade, builds the matching subclass', () => {
    const result = Numerik.pesel().validate('44051401459') // wrong checksum
    expect(result.toException()).toBeInstanceOf(InvalidChecksumException)
  })
})

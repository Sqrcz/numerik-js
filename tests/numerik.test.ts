import { describe, expect, it } from 'vitest'
import {
  Iban,
  IdCard,
  Krs,
  Nip,
  Nrb,
  Numerik,
  Passport,
  Pesel,
  Regon,
  VatEu,
} from '../src/index.js'

const cases = [
  {
    key: 'pesel',
    sample: '44051401458',
    expectedInstance: Pesel,
  },
  {
    key: 'idCard',
    sample: 'ABC123454',
    expectedInstance: IdCard,
  },
  {
    key: 'passport',
    sample: 'AB1234564',
    expectedInstance: Passport,
  },
  {
    key: 'nip',
    sample: '5260250274',
    expectedInstance: Nip,
  },
  {
    key: 'vatEu',
    sample: 'PL5260250274',
    expectedInstance: VatEu,
  },
  {
    key: 'regon',
    sample: '850518457',
    expectedInstance: Regon,
  },
  {
    key: 'krs',
    sample: '0000127206',
    expectedInstance: Krs,
  },
  {
    key: 'nrb',
    sample: '61102010260000000000000000',
    expectedInstance: Nrb,
  },
  {
    key: 'iban',
    sample: 'PL61102010260000000000000000',
    expectedInstance: Iban,
  },
] as const

describe.each(cases)('Numerik.$key()', ({ key, sample, expectedInstance }) => {
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
})

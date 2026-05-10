import { describe, expect, it } from 'vitest'
import { ValidationFailureReason } from '../src/enums/ValidationFailureReason.js'
import { ValidationException } from '../src/exceptions/ValidationException.js'
import { IbanIdentifier } from '../src/identifiers/IbanIdentifier.js'
import { Iban } from '../src/value-objects/Iban.js'

const iban = () => new IbanIdentifier()
const ibanStrict = (strict: boolean) => new IbanIdentifier(strict)

describe('IbanIdentifier — validate()', () => {
  describe('valid inputs', () => {
    const validCases: [string, string][] = [
      ['digits with PL prefix', 'PL61102010260000000000000000'],
      ['lowercase pl prefix', 'pl61102010260000000000000000'],
      ['with spaces', 'PL61 1020 1026 0000 0000 0000 0000'],
      ['with hyphens', 'PL61-1020-1026-0000-0000-0000-0000'],
      ['different sort code', 'PL19109020040000000000000000'],
      ['non-zero account', 'PL54102010261234567890123456'],
    ]

    it.each(validCases)('%s passes validation', (_label, input) => {
      const result = iban().validate(input)
      expect(result.isValid).toBe(true)
      expect(result.failures).toHaveLength(0)
    })
  })

  describe('invalid inputs', () => {
    const invalidCases: [string, string, ValidationFailureReason][] = [
      [
        'missing PL prefix',
        '61102010260000000000000000',
        ValidationFailureReason.InvalidFormat,
      ],
      [
        'wrong country prefix',
        'DE61102010260000000000000000',
        ValidationFailureReason.InvalidFormat,
      ],
      [
        'wrong checksum',
        'PL62102010260000000000000000',
        ValidationFailureReason.InvalidChecksum,
      ],
      [
        'too short after PL (25 digits)',
        'PL6110201026000000000000000',
        ValidationFailureReason.InvalidLength,
      ],
      [
        'too long after PL (27 digits)',
        'PL611020102600000000000000001',
        ValidationFailureReason.InvalidLength,
      ],
      [
        'invalid characters',
        'PL61102010260000000000000ABC',
        ValidationFailureReason.InvalidCharacters,
      ],
    ]

    it.each(
      invalidCases,
    )('%s fails with correct reason', (_label, input, reason) => {
      const result = iban().validate(input)
      expect(result.isFailed()).toBe(true)
      expect(result.hasFailureReason(reason)).toBe(true)
    })
  })

  it('fails when raw input exceeds 40 characters', () => {
    const result = iban().validate(`PL${'6'.repeat(39)}`)
    expect(result.isFailed()).toBe(true)
    expect(result.hasFailureReason(ValidationFailureReason.InvalidLength)).toBe(
      true,
    )
  })
})

describe('IbanIdentifier — isValid()', () => {
  it('returns true for valid IBAN', () => {
    expect(iban().isValid('PL61102010260000000000000000')).toBe(true)
  })

  it('returns false for missing prefix', () => {
    expect(iban().isValid('61102010260000000000000000')).toBe(false)
  })
})

describe('IbanIdentifier — isStrict()', () => {
  it('is enabled by default', () => {
    expect(iban().isStrict()).toBe(true)
  })

  it('can be disabled', () => {
    expect(ibanStrict(false).isStrict()).toBe(false)
  })
})

describe('IbanIdentifier — parse()', () => {
  it('returns an Iban instance', () => {
    expect(iban().parse('PL61102010260000000000000000')).toBeInstanceOf(Iban)
  })

  it('preserves raw input', () => {
    expect(iban().parse('PL61 1020 1026 0000 0000 0000 0000').getRaw()).toBe(
      'PL61 1020 1026 0000 0000 0000 0000',
    )
  })

  it('normalizes input (strips spaces)', () => {
    expect(
      iban().parse('PL61 1020 1026 0000 0000 0000 0000').getNormalized(),
    ).toBe('PL61102010260000000000000000')
  })

  it('normalizes input (strips hyphens)', () => {
    expect(
      iban().parse('PL61-1020-1026-0000-0000-0000-0000').getNormalized(),
    ).toBe('PL61102010260000000000000000')
  })

  it('normalizes lowercase prefix to PL', () => {
    expect(iban().parse('pl61102010260000000000000000').getNormalized()).toBe(
      'PL61102010260000000000000000',
    )
  })

  it('toString returns normalized', () => {
    expect(String(iban().parse('PL61102010260000000000000000'))).toBe(
      'PL61102010260000000000000000',
    )
  })

  describe('value object accessors', () => {
    const parsed = () => iban().parse('PL61102010260000000000000000')

    it('getFormatted returns space-separated groups of 4', () => {
      expect(parsed().getFormatted()).toBe('PL61 1020 1026 0000 0000 0000 0000')
    })

    it('getCountryCode returns PL', () => {
      expect(parsed().getCountryCode()).toBe('PL')
    })

    it('getNrb returns the 26-digit NRB string', () => {
      expect(parsed().getNrb()).toBe('61102010260000000000000000')
    })

    it('getCheckDigits returns two digits after PL', () => {
      expect(parsed().getCheckDigits()).toBe('61')
    })

    it('getSortCode returns 8-digit bank routing code', () => {
      expect(parsed().getSortCode()).toBe('10201026')
    })

    it('getBankCode returns first 3 digits of sort code', () => {
      expect(parsed().getBankCode()).toBe('102')
    })

    it('getBankCode varies by IBAN', () => {
      expect(iban().parse('PL19109020040000000000000000').getBankCode()).toBe(
        '109',
      )
    })

    it('getAccountNumber returns last 16 digits', () => {
      expect(parsed().getAccountNumber()).toBe('0000000000000000')
    })

    it('getAccountNumber returns correct digits for non-zero account', () => {
      expect(
        iban().parse('PL54102010261234567890123456').getAccountNumber(),
      ).toBe('1234567890123456')
    })
  })

  describe('exceptions', () => {
    it('throws ValidationException for missing prefix', () => {
      expect(() => iban().parse('61102010260000000000000000')).toThrow(
        ValidationException,
      )
    })

    it('throws ValidationException for wrong checksum', () => {
      expect(() => iban().parse('PL62102010260000000000000000')).toThrow(
        ValidationException,
      )
    })

    it('throws ValidationException for too short', () => {
      expect(() => iban().parse('PL6110201026000000000000000')).toThrow(
        ValidationException,
      )
    })
  })
})

describe('IbanIdentifier — tryParse()', () => {
  it('returns Iban for valid input', () => {
    expect(iban().tryParse('PL61102010260000000000000000')).toBeInstanceOf(Iban)
  })

  it('returns null for missing prefix', () => {
    expect(iban().tryParse('61102010260000000000000000')).toBeNull()
  })

  it('returns null for wrong checksum', () => {
    expect(iban().tryParse('PL62102010260000000000000000')).toBeNull()
  })
})

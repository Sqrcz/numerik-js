import { describe, expect, it } from 'vitest'
import { ValidationFailureReason } from '../src/enums/ValidationFailureReason.js'
import { ValidationException } from '../src/exceptions/ValidationException.js'
import { NrbIdentifier } from '../src/identifiers/NrbIdentifier.js'
import { Nrb } from '../src/value-objects/Nrb.js'

const nrb = () => new NrbIdentifier()
const nrbStrict = (strict: boolean) => new NrbIdentifier(strict)

describe('NrbIdentifier — validate()', () => {
  describe('valid inputs', () => {
    const validCases: [string, string][] = [
      ['digits only', '61102010260000000000000000'],
      ['with spaces', '61 1020 1026 0000 0000 0000 0000'],
      ['IBAN format (PL prefix stripped)', 'PL61102010260000000000000000'],
      ['IBAN with spaces', 'PL61 1020 1026 0000 0000 0000 0000'],
      ['hyphenated NRB', '61-1020-1026-0000-0000-0000-0000'],
      ['different sort code', '19109020040000000000000000'],
      ['non-zero account', '54102010261234567890123456'],
    ]

    it.each(validCases)('%s passes validation', (_label, input) => {
      const result = nrb().validate(input)
      expect(result.isValid).toBe(true)
      expect(result.failures).toHaveLength(0)
    })
  })

  describe('invalid inputs', () => {
    const invalidCases: [string, string, ValidationFailureReason][] = [
      [
        'wrong checksum',
        '62102010260000000000000000',
        ValidationFailureReason.InvalidChecksum,
      ],
      [
        'too short (25 digits)',
        '6110201026000000000000000',
        ValidationFailureReason.InvalidLength,
      ],
      [
        'too long (27 digits)',
        '611020102600000000000000001',
        ValidationFailureReason.InvalidLength,
      ],
      [
        'invalid characters',
        '61102010260000000000000ABC',
        ValidationFailureReason.InvalidCharacters,
      ],
    ]

    it.each(
      invalidCases,
    )('%s fails with correct reason', (_label, input, reason) => {
      const result = nrb().validate(input)
      expect(result.isFailed()).toBe(true)
      expect(result.hasFailureReason(reason)).toBe(true)
    })
  })

  it('fails when raw input exceeds 40 characters', () => {
    const result = nrb().validate('6'.repeat(41))
    expect(result.isFailed()).toBe(true)
    expect(result.hasFailureReason(ValidationFailureReason.InvalidLength)).toBe(
      true,
    )
  })
})

describe('NrbIdentifier — isValid()', () => {
  it('returns true for valid NRB', () => {
    expect(nrb().isValid('61102010260000000000000000')).toBe(true)
  })

  it('returns false for wrong checksum', () => {
    expect(nrb().isValid('62102010260000000000000000')).toBe(false)
  })
})

describe('NrbIdentifier — isStrict()', () => {
  it('is enabled by default', () => {
    expect(nrb().isStrict()).toBe(true)
  })

  it('can be disabled', () => {
    expect(nrbStrict(false).isStrict()).toBe(false)
  })
})

describe('NrbIdentifier — parse()', () => {
  it('returns an Nrb instance', () => {
    expect(nrb().parse('61102010260000000000000000')).toBeInstanceOf(Nrb)
  })

  it('preserves raw input', () => {
    expect(nrb().parse('61 1020 1026 0000 0000 0000 0000').getRaw()).toBe(
      '61 1020 1026 0000 0000 0000 0000',
    )
  })

  it('normalizes input with spaces', () => {
    expect(
      nrb().parse('61 1020 1026 0000 0000 0000 0000').getNormalized(),
    ).toBe('61102010260000000000000000')
  })

  it('strips PL prefix from IBAN format', () => {
    expect(nrb().parse('PL61102010260000000000000000').getNormalized()).toBe(
      '61102010260000000000000000',
    )
  })

  it('toString returns normalized', () => {
    expect(String(nrb().parse('61102010260000000000000000'))).toBe(
      '61102010260000000000000000',
    )
  })

  describe('value object accessors', () => {
    const parsed = () => nrb().parse('61102010260000000000000000')

    it('getFormatted returns space-separated standard format', () => {
      expect(parsed().getFormatted()).toBe('61 1020 1026 0000 0000 0000 0000')
    })

    it('getIban returns PL-prefixed NRB', () => {
      expect(parsed().getIban()).toBe('PL61102010260000000000000000')
    })

    it('getFormattedIban returns grouped IBAN string', () => {
      expect(parsed().getFormattedIban()).toBe(
        'PL61 1020 1026 0000 0000 0000 0000',
      )
    })

    it('getCheckDigits returns first two digits', () => {
      expect(parsed().getCheckDigits()).toBe('61')
    })

    it('getSortCode returns 8-digit bank routing code', () => {
      expect(parsed().getSortCode()).toBe('10201026')
    })

    it('getBankCode returns first 3 digits of sort code', () => {
      expect(parsed().getBankCode()).toBe('102')
    })

    it('getBankCode varies by sort code', () => {
      expect(nrb().parse('19109020040000000000000000').getBankCode()).toBe(
        '109',
      )
    })

    it('getAccountNumber returns last 16 digits', () => {
      expect(parsed().getAccountNumber()).toBe('0000000000000000')
    })

    it('getAccountNumber returns correct digits for non-zero account', () => {
      expect(nrb().parse('54102010261234567890123456').getAccountNumber()).toBe(
        '1234567890123456',
      )
    })
  })

  describe('exceptions', () => {
    it('throws ValidationException for wrong checksum', () => {
      expect(() => nrb().parse('62102010260000000000000000')).toThrow(
        ValidationException,
      )
    })

    it('throws ValidationException for invalid characters', () => {
      expect(() => nrb().parse('61102010260000000000000ABC')).toThrow(
        ValidationException,
      )
    })

    it('throws ValidationException for too short', () => {
      expect(() => nrb().parse('6110201026000000000000000')).toThrow(
        ValidationException,
      )
    })
  })
})

describe('NrbIdentifier — tryParse()', () => {
  it('returns Nrb for valid input', () => {
    expect(nrb().tryParse('61102010260000000000000000')).toBeInstanceOf(Nrb)
  })

  it('returns null for wrong checksum', () => {
    expect(nrb().tryParse('62102010260000000000000000')).toBeNull()
  })

  it('returns null for invalid format', () => {
    expect(nrb().tryParse('not-an-nrb')).toBeNull()
  })
})

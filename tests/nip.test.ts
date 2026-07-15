import { describe, expect, it } from 'vitest'
import { ValidationFailureReason } from '../src/enums/ValidationFailureReason.js'
import { InvalidChecksumException } from '../src/exceptions/InvalidChecksumException.js'
import { InvalidFormatException } from '../src/exceptions/InvalidFormatException.js'
import { NipIdentifier } from '../src/identifiers/NipIdentifier.js'
import { Nip } from '../src/value-objects/Nip.js'

const nip = () => new NipIdentifier()
const nipStrict = (strict: boolean) => new NipIdentifier(strict)

describe('NipIdentifier — validate()', () => {
  describe('valid inputs', () => {
    const validCases: [string, string][] = [
      ['digits only', '5260250274'],
      ['with hyphens', '526-025-02-74'],
      ['with spaces', '526 025 02 74'],
      ['another valid', '1002345672'],
    ]

    it.each(validCases)('%s passes validation', (_label, input) => {
      const result = nip().validate(input)
      expect(result.isValid).toBe(true)
      expect(result.failures).toHaveLength(0)
    })
  })

  describe('invalid inputs', () => {
    const invalidCases: [string, string, ValidationFailureReason][] = [
      [
        'tax office code 000',
        '0001234567',
        ValidationFailureReason.InvalidFormat,
      ],
      ['wrong checksum', '5260250275', ValidationFailureReason.InvalidChecksum],
      ['too short', '526025027', ValidationFailureReason.InvalidLength],
      ['too long', '52602502741', ValidationFailureReason.InvalidLength],
      [
        'invalid characters',
        '526ABC0274',
        ValidationFailureReason.InvalidCharacters,
      ],
    ]

    it.each(invalidCases)(
      '%s fails with correct reason',
      (_label, input, reason) => {
        const result = nip().validate(input)
        expect(result.isFailed()).toBe(true)
        expect(result.hasFailureReason(reason)).toBe(true)
      },
    )
  })

  describe('strict mode — all same digit', () => {
    const strictCases: [string, string][] = [
      ['all ones', '1111111111'],
      ['all nines', '9999999999'],
    ]

    it.each(strictCases)('%s fails in strict mode', (_label, input) => {
      const result = nipStrict(true).validate(input)
      expect(result.isFailed()).toBe(true)
      expect(
        result.hasFailureReason(ValidationFailureReason.AllSameDigit),
      ).toBe(true)
    })

    it('passes for all-same-digit in non-strict mode', () => {
      expect(nipStrict(false).validate('1111111111').isValid).toBe(true)
    })
  })

  it('fails when input exceeds 32 characters', () => {
    const result = nip().validate('1'.repeat(33))
    expect(result.isFailed()).toBe(true)
    expect(result.hasFailureReason(ValidationFailureReason.InvalidLength)).toBe(
      true,
    )
  })

  it('does not reject input of exactly 32 characters with exceeds-maximum message', () => {
    const result = nip().validate('5'.repeat(32))
    const failure = result.getFirstFailure()
    expect(failure).not.toBeNull()
    expect(failure?.message).not.toContain('exceeds maximum')
  })
})

describe('NipIdentifier — isValid()', () => {
  it('returns true for valid NIP', () => {
    expect(nip().isValid('5260250274')).toBe(true)
  })

  it('returns false for invalid NIP', () => {
    expect(nip().isValid('5260250275')).toBe(false)
  })
})

describe('NipIdentifier — isStrict()', () => {
  it('is enabled by default', () => {
    expect(nip().isStrict()).toBe(true)
  })

  it('can be disabled', () => {
    expect(nipStrict(false).isStrict()).toBe(false)
  })
})

describe('NipIdentifier — parse()', () => {
  it('returns a Nip instance', () => {
    expect(nip().parse('5260250274')).toBeInstanceOf(Nip)
  })

  it('preserves raw input', () => {
    expect(nip().parse('526-025-02-74').getRaw()).toBe('526-025-02-74')
  })

  it('normalizes input', () => {
    expect(nip().parse('526-025-02-74').getNormalized()).toBe('5260250274')
  })

  it('toString returns normalized', () => {
    expect(String(nip().parse('526-025-02-74'))).toBe('5260250274')
  })

  describe('value object accessors', () => {
    it('getFormatted returns NNN-NNN-NN-NN', () => {
      expect(nip().parse('5260250274').getFormatted()).toBe('526-025-02-74')
    })

    it('getFormattedAlternative returns NNN-NN-NN-NNN', () => {
      expect(nip().parse('5260250274').getFormattedAlternative()).toBe(
        '526-02-50-274',
      )
    })

    it('getTaxOfficeCode returns first 3 digits', () => {
      expect(nip().parse('5260250274').getTaxOfficeCode()).toBe('526')
    })
  })

  describe('exceptions', () => {
    it('throws InvalidFormatException for wrong length', () => {
      expect(() => nip().parse('526025027')).toThrow(InvalidFormatException)
    })

    it('throws InvalidFormatException for invalid characters', () => {
      expect(() => nip().parse('526ABC0274')).toThrow(InvalidFormatException)
    })

    it('throws InvalidFormatException for 000 tax office code', () => {
      expect(() => nip().parse('0001234567')).toThrow(InvalidFormatException)
    })

    it('throws InvalidChecksumException for wrong checksum', () => {
      expect(() => nip().parse('5260250275')).toThrow(InvalidChecksumException)
    })
  })
})

describe('NipIdentifier — tryParse()', () => {
  it('returns Nip for valid input', () => {
    expect(nip().tryParse('5260250274')).toBeInstanceOf(Nip)
  })

  it('returns null for invalid input', () => {
    expect(nip().tryParse('5260250275')).toBeNull()
  })

  it('returns null for invalid format', () => {
    expect(nip().tryParse('not-a-nip')).toBeNull()
  })
})

import { describe, expect, it } from 'vitest'
import { ValidationFailureReason } from '../src/enums/ValidationFailureReason.js'
import { InvalidFormatException } from '../src/exceptions/InvalidFormatException.js'
import { KrsIdentifier } from '../src/identifiers/KrsIdentifier.js'
import { Krs } from '../src/value-objects/Krs.js'

const krs = () => new KrsIdentifier()
const krsStrict = (strict: boolean) => new KrsIdentifier(strict)

describe('KrsIdentifier — validate()', () => {
  describe('valid inputs', () => {
    const validCases: [string, string][] = [
      ['full 10 digits with leading zeros', '0000127206'],
      ['short form without leading zeros', '127206'],
      ['minimum valid', '1'],
      ['large number', '9999999998'],
    ]

    it.each(validCases)('%s passes validation', (_label, input) => {
      const result = krs().validate(input)
      expect(result.isValid).toBe(true)
      expect(result.failures).toHaveLength(0)
    })
  })

  describe('invalid inputs', () => {
    const invalidCases: [string, string, ValidationFailureReason][] = [
      ['all zeros', '0000000000', ValidationFailureReason.AllZeros],
      ['too long', '00001272060', ValidationFailureReason.InvalidLength],
      ['empty after strip', '   ', ValidationFailureReason.InvalidLength],
      [
        'invalid characters',
        'KRS1234567',
        ValidationFailureReason.InvalidCharacters,
      ],
      [
        'hyphens not allowed',
        '0001-27206',
        ValidationFailureReason.InvalidCharacters,
      ],
    ]

    it.each(invalidCases)(
      '%s fails with correct reason',
      (_label, input, reason) => {
        const result = krs().validate(input)
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
      const result = krsStrict(true).validate(input)
      expect(result.isFailed()).toBe(true)
      expect(
        result.hasFailureReason(ValidationFailureReason.AllSameDigit),
      ).toBe(true)
    })

    it('passes for all-same-digit in non-strict mode', () => {
      expect(krsStrict(false).validate('1111111111').isValid).toBe(true)
    })
  })

  it('fails when input exceeds 32 characters', () => {
    const result = krs().validate('1'.repeat(33))
    expect(result.isFailed()).toBe(true)
    expect(result.hasFailureReason(ValidationFailureReason.InvalidLength)).toBe(
      true,
    )
  })

  it('does not reject input of exactly 32 characters with exceeds-maximum message', () => {
    const result = krs().validate('1'.repeat(32))
    const failure = result.getFirstFailure()
    expect(failure).not.toBeNull()
    expect(failure?.message).not.toContain('exceeds maximum')
  })
})

describe('KrsIdentifier — isValid()', () => {
  it('returns true for valid KRS', () => {
    expect(krs().isValid('0000127206')).toBe(true)
  })

  it('returns false for all zeros', () => {
    expect(krs().isValid('0000000000')).toBe(false)
  })
})

describe('KrsIdentifier — isStrict()', () => {
  it('is enabled by default', () => {
    expect(krs().isStrict()).toBe(true)
  })

  it('can be disabled', () => {
    expect(krsStrict(false).isStrict()).toBe(false)
  })
})

describe('KrsIdentifier — parse()', () => {
  it('returns a Krs instance', () => {
    expect(krs().parse('0000127206')).toBeInstanceOf(Krs)
  })

  it('preserves raw input', () => {
    expect(krs().parse('127206').getRaw()).toBe('127206')
  })

  it('normalizes input (strips spaces)', () => {
    expect(krs().parse('127 206').getNormalized()).toBe('127206')
  })

  it('toString returns normalized', () => {
    expect(String(krs().parse('127206'))).toBe('127206')
  })

  describe('value object accessors', () => {
    it('getFormatted returns zero-padded 10-digit string', () => {
      expect(krs().parse('127206').getFormatted()).toBe('0000127206')
    })

    it('getNumericValue returns integer without leading zeros', () => {
      expect(krs().parse('0000127206').getNumericValue()).toBe(127206)
    })
  })

  describe('exceptions', () => {
    it('throws InvalidFormatException for all zeros', () => {
      expect(() => krs().parse('0000000000')).toThrow(InvalidFormatException)
    })

    it('throws InvalidFormatException for invalid characters', () => {
      expect(() => krs().parse('KRS1234567')).toThrow(InvalidFormatException)
    })

    it('throws InvalidFormatException for too long', () => {
      expect(() => krs().parse('00001272060')).toThrow(InvalidFormatException)
    })
  })
})

describe('KrsIdentifier — tryParse()', () => {
  it('returns Krs for valid input', () => {
    expect(krs().tryParse('0000127206')).toBeInstanceOf(Krs)
  })

  it('returns null for invalid input', () => {
    expect(krs().tryParse('0000000000')).toBeNull()
  })

  it('returns null for invalid format', () => {
    expect(krs().tryParse('not-a-krs')).toBeNull()
  })
})

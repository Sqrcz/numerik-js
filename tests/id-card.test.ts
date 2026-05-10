import { describe, expect, it } from 'vitest'
import { ValidationFailureReason } from '../src/enums/ValidationFailureReason.js'
import { ValidationException } from '../src/exceptions/ValidationException.js'
import { IdCardIdentifier } from '../src/identifiers/IdCardIdentifier.js'
import { IdCard } from '../src/value-objects/IdCard.js'

const idCard = () => new IdCardIdentifier()
const idCardStrict = (strict: boolean) => new IdCardIdentifier(strict)

describe('IdCardIdentifier — validate()', () => {
  describe('valid inputs', () => {
    const validCases: [string, string][] = [
      ['standard uppercase', 'ABC123454'],
      ['different series', 'XYZ987659'],
      ['zeros in number', 'ZBA000008'],
      ['lowercase with hyphens', 'abc-123-454'],
      ['lowercase with spaces', 'abc 123 454'],
    ]

    it.each(validCases)('%s passes validation', (_label, input) => {
      const result = idCard().validate(input)
      expect(result.isValid).toBe(true)
      expect(result.failures).toHaveLength(0)
    })
  })

  describe('invalid inputs', () => {
    const invalidCases: [string, string, ValidationFailureReason][] = [
      ['too short', 'ABC12345', ValidationFailureReason.InvalidLength],
      ['too long', 'ABC1234567', ValidationFailureReason.InvalidLength],
      [
        'digit in series',
        '1BC123456',
        ValidationFailureReason.InvalidCharacters,
      ],
      [
        'letter O in series',
        'OBC123456',
        ValidationFailureReason.InvalidFormat,
      ],
      [
        'letter Q in series',
        'QBC123456',
        ValidationFailureReason.InvalidFormat,
      ],
      [
        'letter in number',
        'ABC12345A',
        ValidationFailureReason.InvalidCharacters,
      ],
      ['wrong checksum', 'ABC123453', ValidationFailureReason.InvalidChecksum],
    ]

    it.each(
      invalidCases,
    )('%s fails with correct reason', (_label, input, reason) => {
      const result = idCard().validate(input)
      expect(result.isFailed()).toBe(true)
      expect(result.hasFailureReason(reason)).toBe(true)
    })
  })

  it('fails when input exceeds 32 characters', () => {
    const result = idCard().validate('1'.repeat(33))
    expect(result.isFailed()).toBe(true)
    expect(result.hasFailureReason(ValidationFailureReason.InvalidLength)).toBe(
      true,
    )
  })

  it('does not reject input of exactly 32 characters with exceeds-maximum message', () => {
    const result = idCard().validate('1'.repeat(32))
    const failure = result.getFirstFailure()
    expect(failure).not.toBeNull()
    expect(failure?.message).not.toContain('exceeds maximum')
  })
})

describe('IdCardIdentifier — isValid()', () => {
  it('returns true for valid ID card', () => {
    expect(idCard().isValid('ABC123454')).toBe(true)
  })

  it('returns false for wrong checksum', () => {
    expect(idCard().isValid('ABC123453')).toBe(false)
  })

  it('returns false for invalid series', () => {
    expect(idCard().isValid('OBC123456')).toBe(false)
  })
})

describe('IdCardIdentifier — isStrict()', () => {
  it('is enabled by default', () => {
    expect(idCard().isStrict()).toBe(true)
  })

  it('can be disabled', () => {
    expect(idCardStrict(false).isStrict()).toBe(false)
  })
})

describe('IdCardIdentifier — parse()', () => {
  it('returns an IdCard instance', () => {
    expect(idCard().parse('ABC123454')).toBeInstanceOf(IdCard)
  })

  it('preserves raw input', () => {
    expect(idCard().parse('abc-123-454').getRaw()).toBe('abc-123-454')
  })

  it('normalizes lowercase with hyphens', () => {
    expect(idCard().parse('abc-123-454').getNormalized()).toBe('ABC123454')
  })

  it('toString returns normalized', () => {
    expect(String(idCard().parse('abc-123-454'))).toBe('ABC123454')
  })

  describe('value object accessors', () => {
    it('getSeries returns first 3 characters', () => {
      expect(idCard().parse('ABC123454').getSeries()).toBe('ABC')
    })

    it('getSequentialNumber returns characters 4–8', () => {
      expect(idCard().parse('ABC123454').getSequentialNumber()).toBe('12345')
    })

    it('getCheckDigit returns last character', () => {
      expect(idCard().parse('ABC123454').getCheckDigit()).toBe('4')
    })
  })

  describe('exceptions', () => {
    it('throws ValidationException for wrong length', () => {
      expect(() => idCard().parse('ABC12345')).toThrow(ValidationException)
    })

    it('throws ValidationException for letter O in series', () => {
      expect(() => idCard().parse('OBC123456')).toThrow(ValidationException)
    })

    it('throws ValidationException for digit in series', () => {
      expect(() => idCard().parse('1BC123456')).toThrow(ValidationException)
    })

    it('throws ValidationException for wrong checksum', () => {
      expect(() => idCard().parse('ABC123453')).toThrow(ValidationException)
    })
  })
})

describe('IdCardIdentifier — tryParse()', () => {
  it('returns IdCard for valid input', () => {
    expect(idCard().tryParse('ABC123454')).toBeInstanceOf(IdCard)
  })

  it('returns null for wrong checksum', () => {
    expect(idCard().tryParse('ABC123453')).toBeNull()
  })

  it('returns null for invalid format', () => {
    expect(idCard().tryParse('OBC123456')).toBeNull()
  })
})

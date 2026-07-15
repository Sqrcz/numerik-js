import { describe, expect, it } from 'vitest'
import { ValidationFailureReason } from '../src/enums/ValidationFailureReason.js'
import { ValidationException } from '../src/exceptions/ValidationException.js'
import { PassportIdentifier } from '../src/identifiers/PassportIdentifier.js'
import { Passport } from '../src/value-objects/Passport.js'

const passport = () => new PassportIdentifier()
const passportStrict = (strict: boolean) => new PassportIdentifier(strict)

describe('PassportIdentifier — validate()', () => {
  describe('valid inputs', () => {
    const validCases: [string, string][] = [
      ['standard uppercase', 'AB1234564'],
      ['all same series letter', 'ZZ1234561'],
      ['zeros in number', 'AA0000000'],
      ['lowercase with spaces', 'ab 123456 4'],
      ['uppercase with hyphens', 'AB-1234564'],
    ]

    it.each(validCases)('%s passes validation', (_label, input) => {
      const result = passport().validate(input)
      expect(result.isValid).toBe(true)
      expect(result.failures).toHaveLength(0)
    })
  })

  describe('invalid inputs', () => {
    const invalidCases: [string, string, ValidationFailureReason][] = [
      ['too short', 'AB123456', ValidationFailureReason.InvalidLength],
      ['too long', 'AB12345678', ValidationFailureReason.InvalidLength],
      [
        'digit in series',
        '1B1234564',
        ValidationFailureReason.InvalidCharacters,
      ],
      [
        'letter in number',
        'AB123456A',
        ValidationFailureReason.InvalidCharacters,
      ],
      ['wrong checksum', 'AB1234563', ValidationFailureReason.InvalidChecksum],
    ]

    it.each(invalidCases)(
      '%s fails with correct reason',
      (_label, input, reason) => {
        const result = passport().validate(input)
        expect(result.isFailed()).toBe(true)
        expect(result.hasFailureReason(reason)).toBe(true)
      },
    )
  })

  it('fails when input exceeds 32 characters', () => {
    const result = passport().validate('1'.repeat(33))
    expect(result.isFailed()).toBe(true)
    expect(result.hasFailureReason(ValidationFailureReason.InvalidLength)).toBe(
      true,
    )
  })

  it('does not reject input of exactly 32 characters with exceeds-maximum message', () => {
    const result = passport().validate('1'.repeat(32))
    const failure = result.getFirstFailure()
    expect(failure).not.toBeNull()
    expect(failure?.message).not.toContain('exceeds maximum')
  })
})

describe('PassportIdentifier — isValid()', () => {
  it('returns true for valid passport', () => {
    expect(passport().isValid('AB1234564')).toBe(true)
  })

  it('returns false for wrong checksum', () => {
    expect(passport().isValid('AB1234563')).toBe(false)
  })

  it('returns false for digit in series', () => {
    expect(passport().isValid('1B1234564')).toBe(false)
  })
})

describe('PassportIdentifier — isStrict()', () => {
  it('is enabled by default', () => {
    expect(passport().isStrict()).toBe(true)
  })

  it('can be disabled', () => {
    expect(passportStrict(false).isStrict()).toBe(false)
  })
})

describe('PassportIdentifier — parse()', () => {
  it('returns a Passport instance', () => {
    expect(passport().parse('AB1234564')).toBeInstanceOf(Passport)
  })

  it('preserves raw input', () => {
    expect(passport().parse('ab 123456 4').getRaw()).toBe('ab 123456 4')
  })

  it('normalizes lowercase with spaces', () => {
    expect(passport().parse('ab 123456 4').getNormalized()).toBe('AB1234564')
  })

  it('toString returns normalized', () => {
    expect(String(passport().parse('ab 123456 4'))).toBe('AB1234564')
  })

  describe('value object accessors', () => {
    it('getSeries returns first 2 characters', () => {
      expect(passport().parse('AB1234564').getSeries()).toBe('AB')
    })

    it('getSequentialNumber returns characters 3–8', () => {
      expect(passport().parse('AB1234564').getSequentialNumber()).toBe('123456')
    })

    it('getCheckDigit returns last character', () => {
      expect(passport().parse('AB1234564').getCheckDigit()).toBe('4')
    })
  })

  describe('exceptions', () => {
    it('throws ValidationException for wrong length', () => {
      expect(() => passport().parse('AB123456')).toThrow(ValidationException)
    })

    it('throws ValidationException for digit in series', () => {
      expect(() => passport().parse('1B1234564')).toThrow(ValidationException)
    })

    it('throws ValidationException for letter in number', () => {
      expect(() => passport().parse('AB123456A')).toThrow(ValidationException)
    })

    it('throws ValidationException for wrong checksum', () => {
      expect(() => passport().parse('AB1234563')).toThrow(ValidationException)
    })
  })
})

describe('PassportIdentifier — tryParse()', () => {
  it('returns Passport for valid input', () => {
    expect(passport().tryParse('AB1234564')).toBeInstanceOf(Passport)
  })

  it('returns null for wrong checksum', () => {
    expect(passport().tryParse('AB1234563')).toBeNull()
  })

  it('returns null for invalid format', () => {
    expect(passport().tryParse('1B1234564')).toBeNull()
  })
})

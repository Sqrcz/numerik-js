import { describe, expect, it } from 'vitest'
import { ValidationFailureReason } from '../src/enums/ValidationFailureReason.js'
import { ValidationException } from '../src/exceptions/ValidationException.js'
import { VatEuIdentifier } from '../src/identifiers/VatEuIdentifier.js'
import { VatEu } from '../src/value-objects/VatEu.js'

const vatEu = () => new VatEuIdentifier()
const vatEuStrict = (strict: boolean) => new VatEuIdentifier(strict)

describe('VatEuIdentifier — validate()', () => {
  describe('valid inputs', () => {
    const validCases: [string, string][] = [
      ['digits only', 'PL5260250274'],
      ['lowercase prefix', 'pl5260250274'],
      ['with hyphens', 'PL526-025-02-74'],
      ['with spaces', 'PL526 025 02 74'],
      ['another valid', 'PL1002345672'],
    ]

    it.each(validCases)('%s passes validation', (_label, input) => {
      const result = vatEu().validate(input)
      expect(result.isValid).toBe(true)
      expect(result.failures).toHaveLength(0)
    })
  })

  describe('invalid inputs', () => {
    const invalidCases: [string, string, ValidationFailureReason][] = [
      ['missing prefix', '5260250274', ValidationFailureReason.InvalidFormat],
      ['wrong prefix', 'DE5260250274', ValidationFailureReason.InvalidFormat],
      [
        'wrong checksum',
        'PL5260250275',
        ValidationFailureReason.InvalidChecksum,
      ],
      [
        'too short after PL',
        'PL526025027',
        ValidationFailureReason.InvalidLength,
      ],
      [
        'too long after PL',
        'PL52602502741',
        ValidationFailureReason.InvalidLength,
      ],
      [
        'invalid characters',
        'PLABC0250274',
        ValidationFailureReason.InvalidCharacters,
      ],
      ['tax office 000', 'PL0001234567', ValidationFailureReason.InvalidFormat],
    ]

    it.each(
      invalidCases,
    )('%s fails with correct reason', (_label, input, reason) => {
      const result = vatEu().validate(input)
      expect(result.isFailed()).toBe(true)
      expect(result.hasFailureReason(reason)).toBe(true)
    })
  })

  describe('strict mode — all same digit', () => {
    it('fails for all-same-digit NIP in strict mode', () => {
      const result = vatEuStrict(true).validate('PL1111111111')
      expect(result.isFailed()).toBe(true)
      expect(
        result.hasFailureReason(ValidationFailureReason.AllSameDigit),
      ).toBe(true)
    })

    it('passes for all-same-digit NIP in non-strict mode', () => {
      expect(vatEuStrict(false).validate('PL1111111111').isValid).toBe(true)
    })
  })

  it('fails when input exceeds 32 characters', () => {
    const result = vatEu().validate('1'.repeat(33))
    expect(result.isFailed()).toBe(true)
    expect(result.hasFailureReason(ValidationFailureReason.InvalidLength)).toBe(
      true,
    )
  })

  it('does not reject input of exactly 32 characters with exceeds-maximum message', () => {
    const result = vatEu().validate('1'.repeat(32))
    const failure = result.getFirstFailure()
    expect(failure).not.toBeNull()
    expect(failure?.reason).not.toBe(ValidationFailureReason.InvalidLength)
  })
})

describe('VatEuIdentifier — isValid()', () => {
  it('returns true for valid VAT-EU', () => {
    expect(vatEu().isValid('PL5260250274')).toBe(true)
  })

  it('returns false for invalid VAT-EU', () => {
    expect(vatEu().isValid('PL5260250275')).toBe(false)
  })
})

describe('VatEuIdentifier — isStrict()', () => {
  it('is enabled by default', () => {
    expect(vatEu().isStrict()).toBe(true)
  })

  it('can be disabled', () => {
    expect(vatEuStrict(false).isStrict()).toBe(false)
  })
})

describe('VatEuIdentifier — parse()', () => {
  it('returns a VatEu instance', () => {
    expect(vatEu().parse('PL5260250274')).toBeInstanceOf(VatEu)
  })

  it('preserves raw input', () => {
    expect(vatEu().parse('PL526-025-02-74').getRaw()).toBe('PL526-025-02-74')
  })

  it('normalizes input', () => {
    expect(vatEu().parse('PL526-025-02-74').getNormalized()).toBe(
      'PL5260250274',
    )
  })

  it('normalizes lowercase prefix', () => {
    expect(vatEu().parse('pl5260250274').getNormalized()).toBe('PL5260250274')
  })

  it('toString returns normalized', () => {
    expect(String(vatEu().parse('PL526-025-02-74'))).toBe('PL5260250274')
  })

  describe('value object accessors', () => {
    it('getCountryCode returns PL', () => {
      expect(vatEu().parse('PL5260250274').getCountryCode()).toBe('PL')
    })

    it('getNip returns 10-digit NIP string', () => {
      expect(vatEu().parse('PL5260250274').getNip()).toBe('5260250274')
    })

    it('getFormatted returns PL NNN-NNN-NN-NN', () => {
      expect(vatEu().parse('PL5260250274').getFormatted()).toBe(
        'PL526-025-02-74',
      )
    })
  })

  describe('exceptions', () => {
    it('throws ValidationException for missing prefix', () => {
      expect(() => vatEu().parse('5260250274')).toThrow(ValidationException)
    })

    it('throws ValidationException for wrong length', () => {
      expect(() => vatEu().parse('PL526025027')).toThrow(ValidationException)
    })

    it('throws ValidationException for wrong checksum', () => {
      expect(() => vatEu().parse('PL5260250275')).toThrow(ValidationException)
    })
  })
})

describe('VatEuIdentifier — tryParse()', () => {
  it('returns VatEu for valid input', () => {
    expect(vatEu().tryParse('PL5260250274')).toBeInstanceOf(VatEu)
  })

  it('returns null for invalid input', () => {
    expect(vatEu().tryParse('PL5260250275')).toBeNull()
  })

  it('returns null for missing prefix', () => {
    expect(vatEu().tryParse('5260250274')).toBeNull()
  })
})

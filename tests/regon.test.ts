import { describe, expect, it } from 'vitest'
import { RegonType } from '../src/enums/RegonType.js'
import { ValidationFailureReason } from '../src/enums/ValidationFailureReason.js'
import { InvalidChecksumException } from '../src/exceptions/InvalidChecksumException.js'
import { InvalidFormatException } from '../src/exceptions/InvalidFormatException.js'
import { RegonIdentifier } from '../src/identifiers/RegonIdentifier.js'
import { Regon } from '../src/value-objects/Regon.js'

const regon = () => new RegonIdentifier()

describe('RegonIdentifier — validate()', () => {
  describe('valid inputs', () => {
    const validCases: [string, string][] = [
      ['9-digit', '850518457'],
      ['9-digit public record', '000331501'],
      ['9-digit with spaces', '850 518 457'],
      ['9-digit diverse weights', '123456785'],
      ['9-digit mod11 edge case (checksum=0)', '000000030'],
      ['14-digit', '85051845749370'],
      ['14-digit mod11 edge case', '00000003010000'],
      ['14-digit non-zero checksum', '85051845770005'],
    ]

    it.each(validCases)('%s passes validation', (_label, input) => {
      const result = regon().validate(input)
      expect(result.isValid).toBe(true)
      expect(result.failures).toHaveLength(0)
    })
  })

  describe('invalid inputs', () => {
    const invalidCases: [string, string, ValidationFailureReason][] = [
      [
        'wrong 9-digit checksum',
        '850518456',
        ValidationFailureReason.InvalidChecksum,
      ],
      [
        'wrong 14-digit base checksum',
        '85051845849370',
        ValidationFailureReason.InvalidChecksum,
      ],
      [
        'wrong 14-digit suffix checksum',
        '85051845749371',
        ValidationFailureReason.InvalidChecksum,
      ],
      ['too short', '85051845', ValidationFailureReason.InvalidLength],
      [
        'invalid length (10 digits)',
        '8505184574',
        ValidationFailureReason.InvalidLength,
      ],
      [
        'invalid characters',
        '85051845A',
        ValidationFailureReason.InvalidCharacters,
      ],
    ]

    it.each(invalidCases)(
      '%s fails with correct reason',
      (_label, input, reason) => {
        const result = regon().validate(input)
        expect(result.isFailed()).toBe(true)
        expect(result.hasFailureReason(reason)).toBe(true)
      },
    )
  })

  it('fails when input exceeds 32 characters', () => {
    const result = regon().validate('1'.repeat(33))
    expect(result.isFailed()).toBe(true)
    expect(result.hasFailureReason(ValidationFailureReason.InvalidLength)).toBe(
      true,
    )
  })

  it('does not reject input of exactly 32 characters with exceeds-maximum message', () => {
    const result = regon().validate('8'.repeat(32))
    const failure = result.getFirstFailure()
    expect(failure).not.toBeNull()
    expect(failure?.message).not.toContain('exceeds maximum')
  })
})

describe('RegonIdentifier — isValid()', () => {
  it('returns true for valid 9-digit REGON', () => {
    expect(regon().isValid('850518457')).toBe(true)
  })

  it('returns true for valid 14-digit REGON', () => {
    expect(regon().isValid('85051845749370')).toBe(true)
  })

  it('returns false for invalid REGON', () => {
    expect(regon().isValid('850518456')).toBe(false)
  })
})

describe('RegonIdentifier — isStrict()', () => {
  it('is enabled by default', () => {
    expect(regon().isStrict()).toBe(true)
  })

  it('can be disabled', () => {
    expect(new RegonIdentifier(false).isStrict()).toBe(false)
  })
})

describe('RegonIdentifier — parse()', () => {
  it('returns a Regon instance', () => {
    expect(regon().parse('850518457')).toBeInstanceOf(Regon)
  })

  it('preserves raw input', () => {
    expect(regon().parse('850 518 457').getRaw()).toBe('850 518 457')
  })

  it('normalizes input', () => {
    expect(regon().parse('850 518 457').getNormalized()).toBe('850518457')
  })

  it('toString returns normalized', () => {
    expect(String(regon().parse('850 518 457'))).toBe('850518457')
  })

  describe('type', () => {
    it('returns Individual for 9-digit', () => {
      expect(regon().parse('850518457').getType()).toBe(RegonType.Individual)
    })

    it('returns LegalEntity for 14-digit', () => {
      expect(regon().parse('85051845749370').getType()).toBe(
        RegonType.LegalEntity,
      )
    })
  })

  describe('getBaseRegon', () => {
    it('returns full normalized string for 9-digit', () => {
      expect(regon().parse('850518457').getBaseRegon()).toBe('850518457')
    })

    it('returns first 9 digits for 14-digit', () => {
      expect(regon().parse('85051845749370').getBaseRegon()).toBe('850518457')
    })
  })

  describe('getLocalUnitSuffix', () => {
    it('returns null for 9-digit', () => {
      expect(regon().parse('850518457').getLocalUnitSuffix()).toBeNull()
    })

    it('returns last 5 digits for 14-digit', () => {
      expect(regon().parse('85051845749370').getLocalUnitSuffix()).toBe('49370')
    })
  })

  describe('isLocalUnit', () => {
    it('returns false for 9-digit', () => {
      expect(regon().parse('850518457').isLocalUnit()).toBe(false)
    })

    it('returns true for 14-digit', () => {
      expect(regon().parse('85051845749370').isLocalUnit()).toBe(true)
    })
  })

  describe('exceptions', () => {
    it('throws InvalidFormatException for wrong length', () => {
      expect(() => regon().parse('85051845')).toThrow(InvalidFormatException)
    })

    it('throws InvalidFormatException for invalid characters', () => {
      expect(() => regon().parse('85051845A')).toThrow(InvalidFormatException)
    })

    it('throws InvalidChecksumException for wrong checksum', () => {
      expect(() => regon().parse('850518456')).toThrow(InvalidChecksumException)
    })
  })
})

describe('RegonIdentifier — tryParse()', () => {
  it('returns Regon for valid input', () => {
    expect(regon().tryParse('850518457')).toBeInstanceOf(Regon)
  })

  it('returns null for invalid checksum', () => {
    expect(regon().tryParse('850518456')).toBeNull()
  })

  it('returns null for invalid format', () => {
    expect(regon().tryParse('not-a-regon')).toBeNull()
  })
})

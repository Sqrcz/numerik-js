import { describe, expect, it } from 'vitest'
import { Gender } from '../src/enums/Gender.js'
import { ValidationFailureReason } from '../src/enums/ValidationFailureReason.js'
import { ValidationException } from '../src/exceptions/ValidationException.js'
import { PeselIdentifier } from '../src/identifiers/PeselIdentifier.js'
import { Pesel } from '../src/value-objects/Pesel.js'

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const pesel = () => new PeselIdentifier()
const peselStrict = (strict: boolean) => new PeselIdentifier(strict)

describe('PeselIdentifier — validate()', () => {
  describe('valid inputs', () => {
    const validCases: [string, string][] = [
      ['1900s male', '44051401458'],
      ['1900s female', '90123112340'],
      ['1900s month 12', '44121401458'],
      ['2000s male', '02210213452'],
      ['2000s month 32', '05322001227'],
      ['1900s month 1', '44011401454'],
      ['1800s female', '98831512348'],
      ['1800s month 81', '98811501236'],
      ['1800s month 92', '98922001241'],
      ['1996 leap day', '96022901236'],
      ['with spaces', '44051 401458'],
    ]

    it.each(validCases)('%s passes validation', (_label, input) => {
      const result = pesel().validate(input)
      expect(result.isValid).toBe(true)
      expect(result.failures).toHaveLength(0)
    })
  })

  describe('invalid inputs', () => {
    const invalidCases: [string, string, ValidationFailureReason][] = [
      [
        'wrong checksum',
        '44051401459',
        ValidationFailureReason.InvalidChecksum,
      ],
      ['too short', '4405140145', ValidationFailureReason.InvalidLength],
      ['too long', '444051401458', ValidationFailureReason.InvalidLength],
      [
        'invalid chars',
        '4405140145A',
        ValidationFailureReason.InvalidCharacters,
      ],
      ['invalid month 00', '44001401453', ValidationFailureReason.InvalidMonth],
      ['invalid month 13', '44131401453', ValidationFailureReason.InvalidMonth],
      [
        'invalid date (Feb 31)',
        '44023101452',
        ValidationFailureReason.InvalidDate,
      ],
      ['all same digit', '22222222222', ValidationFailureReason.AllSameDigit],
    ]

    it.each(
      invalidCases,
    )('%s fails with correct reason', (_label, input, reason) => {
      const result = pesel().validate(input)
      expect(result.isFailed()).toBe(true)
      expect(result.hasFailureReason(reason)).toBe(true)
    })
  })

  it('fails when input exceeds 32 characters', () => {
    const result = pesel().validate('1'.repeat(33))
    expect(result.isFailed()).toBe(true)
    expect(result.hasFailureReason(ValidationFailureReason.InvalidLength)).toBe(
      true,
    )
  })

  it('does not reject input of exactly 32 characters with exceeds-maximum message', () => {
    const result = pesel().validate('4'.repeat(32))
    const failure = result.getFirstFailure()
    expect(failure).not.toBeNull()
    expect(failure?.message).not.toContain('exceeds maximum')
  })

  describe('strict mode — future date', () => {
    it('fails for future date in strict mode', () => {
      const result = peselStrict(true).validate('30210100018')
      expect(result.isFailed()).toBe(true)
      expect(result.hasFailureReason(ValidationFailureReason.FutureDate)).toBe(
        true,
      )
    })

    it('passes for future date in non-strict mode', () => {
      const result = peselStrict(false).validate('30210100018')
      expect(result.isValid).toBe(true)
    })
  })

  describe('strict mode — all same digit', () => {
    it('fails for all-same-digit in strict mode', () => {
      const result = peselStrict(true).validate('22222222222')
      expect(result.isFailed()).toBe(true)
      expect(
        result.hasFailureReason(ValidationFailureReason.AllSameDigit),
      ).toBe(true)
    })

    it('passes for all-same-digit in non-strict mode', () => {
      const result = peselStrict(false).validate('22222222222')
      expect(result.isValid).toBe(true)
    })
  })
})

describe('PeselIdentifier — isValid()', () => {
  it('returns true for valid PESEL', () => {
    expect(pesel().isValid('44051401458')).toBe(true)
  })

  it('returns false for invalid checksum', () => {
    expect(pesel().isValid('44051401459')).toBe(false)
  })

  it('returns false for wrong length', () => {
    expect(pesel().isValid('4405140145')).toBe(false)
  })
})

describe('PeselIdentifier — isStrict()', () => {
  it('is enabled by default', () => {
    expect(pesel().isStrict()).toBe(true)
  })

  it('can be disabled', () => {
    expect(peselStrict(false).isStrict()).toBe(false)
  })
})

describe('PeselIdentifier — parse()', () => {
  it('returns a Pesel instance', () => {
    expect(pesel().parse('44051401458')).toBeInstanceOf(Pesel)
  })

  it('preserves raw input', () => {
    expect(pesel().parse('44051 401458').getRaw()).toBe('44051 401458')
  })

  it('normalizes input', () => {
    expect(pesel().parse('44051 401458').getNormalized()).toBe('44051401458')
  })

  it('toString returns normalized', () => {
    expect(String(pesel().parse('44051 401458'))).toBe('44051401458')
  })

  describe('birth date', () => {
    it('correct for 1900s', () => {
      expect(formatDate(pesel().parse('44051401458').getBirthDate())).toBe(
        '1944-05-14',
      )
    })

    it('correct for 1990s female', () => {
      expect(formatDate(pesel().parse('90123112340').getBirthDate())).toBe(
        '1990-12-31',
      )
    })

    it('correct for 2000s', () => {
      expect(formatDate(pesel().parse('02210213452').getBirthDate())).toBe(
        '2002-01-02',
      )
    })

    it('correct for 1800s', () => {
      expect(formatDate(pesel().parse('98831512348').getBirthDate())).toBe(
        '1898-03-15',
      )
    })

    it('correct for 2100s', () => {
      expect(
        formatDate(peselStrict(false).parse('00461501232').getBirthDate()),
      ).toBe('2100-06-15')
    })

    it('correct for 2100s January (lower boundary month 41)', () => {
      expect(
        formatDate(peselStrict(false).parse('00411001232').getBirthDate()),
      ).toBe('2100-01-10')
    })

    it('correct for 2100s December (upper boundary month 52)', () => {
      expect(
        formatDate(peselStrict(false).parse('00522001228').getBirthDate()),
      ).toBe('2100-12-20')
    })

    it('correct for 2200s', () => {
      expect(
        formatDate(peselStrict(false).parse('00652001248').getBirthDate()),
      ).toBe('2200-05-20')
    })

    it('correct for 2200s January (lower boundary month 61)', () => {
      expect(
        formatDate(peselStrict(false).parse('00611501233').getBirthDate()),
      ).toBe('2200-01-15')
    })

    it('correct for 2200s December (upper boundary month 72)', () => {
      expect(
        formatDate(peselStrict(false).parse('00722001224').getBirthDate()),
      ).toBe('2200-12-20')
    })

    it('correct for leap day 1996', () => {
      expect(formatDate(pesel().parse('96022901236').getBirthDate())).toBe(
        '1996-02-29',
      )
    })

    it('correct for future date in non-strict mode', () => {
      expect(
        formatDate(peselStrict(false).parse('30210100018').getBirthDate()),
      ).toBe('2030-01-01')
    })
  })

  describe('gender', () => {
    it('returns Male for odd ordinal digit', () => {
      expect(pesel().parse('44051401458').getGender()).toBe(Gender.Male)
    })

    it('returns Female for even ordinal digit', () => {
      expect(pesel().parse('90123112340').getGender()).toBe(Gender.Female)
    })

    it('isMale returns true for male', () => {
      expect(pesel().parse('44051401458').isMale()).toBe(true)
    })

    it('isFemale returns true for female', () => {
      expect(pesel().parse('90123112340').isFemale()).toBe(true)
    })

    it('isMale returns false for female', () => {
      expect(pesel().parse('90123112340').isMale()).toBe(false)
    })

    it('isFemale returns false for male', () => {
      expect(pesel().parse('44051401458').isFemale()).toBe(false)
    })
  })

  describe('ordinal number', () => {
    it('correct when leading digit is zero (0145)', () => {
      expect(pesel().parse('44051401458').getOrdinalNumber()).toBe(145)
    })

    it('correct when no leading zero (1234)', () => {
      expect(pesel().parse('90123112340').getOrdinalNumber()).toBe(1234)
    })
  })

  describe('age and adult', () => {
    it('getAge returns non-negative integer', () => {
      expect(pesel().parse('44051401458').getAge()).toBeGreaterThanOrEqual(0)
    })

    it('isAdult returns true for person born in 1944', () => {
      expect(pesel().parse('44051401458').isAdult()).toBe(true)
    })

    it('isAdult returns false for person born in 2020', () => {
      expect(pesel().parse('20230112351').isAdult()).toBe(false)
    })
  })

  describe('century', () => {
    it('returns 1900 for 1940s birth', () => {
      expect(pesel().parse('44051401458').getCentury()).toBe(1900)
    })

    it('returns 2000 for 2000s birth', () => {
      expect(pesel().parse('02210213452').getCentury()).toBe(2000)
    })

    it('returns 1800 for 1800s birth', () => {
      expect(pesel().parse('98831512348').getCentury()).toBe(1800)
    })

    it('returns 2100 for 2100s birth', () => {
      expect(peselStrict(false).parse('00461501232').getCentury()).toBe(2100)
    })

    it('returns 2200 for 2200s birth', () => {
      expect(peselStrict(false).parse('00652001248').getCentury()).toBe(2200)
    })
  })

  describe('getBirthDate defensive copy', () => {
    it('mutating returned date does not affect internal state', () => {
      const p = pesel().parse('44051401458')
      const d = p.getBirthDate()
      d.setFullYear(1999)
      expect(formatDate(p.getBirthDate())).toBe('1944-05-14')
    })
  })
})

describe('PeselIdentifier — parse() exceptions', () => {
  it('throws ValidationException for wrong length', () => {
    expect(() => pesel().parse('4405140145')).toThrow(ValidationException)
  })

  it('throws ValidationException for invalid characters', () => {
    expect(() => pesel().parse('4405140145A')).toThrow(ValidationException)
  })

  it('throws ValidationException for invalid checksum', () => {
    expect(() => pesel().parse('44051401459')).toThrow(ValidationException)
  })

  it('throws ValidationException for invalid date (Feb 31)', () => {
    expect(() => pesel().parse('44023101452')).toThrow(ValidationException)
  })

  it('throws ValidationException for invalid month encoding', () => {
    expect(() => pesel().parse('44001401453')).toThrow(ValidationException)
  })

  it('throws ValidationException for future date in strict mode', () => {
    expect(() => peselStrict(true).parse('30210100018')).toThrow(
      ValidationException,
    )
  })

  it('succeeds for future date in non-strict mode', () => {
    expect(() => peselStrict(false).parse('30210100018')).not.toThrow()
  })
})

describe('PeselIdentifier — tryParse()', () => {
  it('returns Pesel instance for valid input', () => {
    expect(pesel().tryParse('44051401458')).toBeInstanceOf(Pesel)
  })

  it('returns null for invalid checksum', () => {
    expect(pesel().tryParse('44051401459')).toBeNull()
  })

  it('returns null for invalid format', () => {
    expect(pesel().tryParse('not-a-pesel')).toBeNull()
  })

  it('returns null for invalid date', () => {
    expect(pesel().tryParse('44023101452')).toBeNull()
  })
})

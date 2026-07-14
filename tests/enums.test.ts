import { describe, expect, it } from 'vitest'
import { Gender } from '../src/enums/Gender.js'
import { RegonType } from '../src/enums/RegonType.js'
import { ValidationFailureReason } from '../src/enums/ValidationFailureReason.js'

describe('Gender', () => {
  it('exports as a runtime-usable value, not just a type', () => {
    expect(Gender.Male).toBe('male')
    expect(Gender.Female).toBe('female')
  })
})

describe('RegonType', () => {
  it('exports as a runtime-usable value, not just a type', () => {
    expect(RegonType.Individual).toBe('individual')
    expect(RegonType.LegalEntity).toBe('legal_entity')
  })
})

describe('ValidationFailureReason', () => {
  it('exports as a runtime-usable value, not just a type', () => {
    expect(ValidationFailureReason.InvalidChecksum).toBe('invalid_checksum')
  })
})

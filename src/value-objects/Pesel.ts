import type { IdentifierInterface } from '../contracts/IdentifierInterface.js'
import { Gender } from '../enums/Gender.js'

export class Pesel implements IdentifierInterface {
  constructor(
    private readonly raw: string,
    private readonly normalized: string,
    private readonly birthDate: Date,
    private readonly gender: Gender,
    private readonly ordinalNumber: number,
  ) {}

  getRaw(): string {
    return this.raw
  }

  getNormalized(): string {
    return this.normalized
  }

  toString(): string {
    return this.normalized
  }

  getBirthDate(): Date {
    return new Date(this.birthDate)
  }

  getGender(): Gender {
    return this.gender
  }

  getOrdinalNumber(): number {
    return this.ordinalNumber
  }

  isMale(): boolean {
    return this.gender === Gender.Male
  }

  isFemale(): boolean {
    return this.gender === Gender.Female
  }

  getAge(): number {
    const today = new Date()
    const birth = this.birthDate
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  isAdult(): boolean {
    return this.getAge() >= 18
  }

  getCentury(): number {
    const year = this.birthDate.getFullYear()
    return year - (year % 100)
  }
}

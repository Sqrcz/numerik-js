import { type RefinementCtx, z } from 'zod'
import type { ValidatorInterface } from '../contracts/ValidatorInterface.js'
import { Numerik } from '../Numerik.js'
import type { Iban } from '../value-objects/Iban.js'
import type { IdCard } from '../value-objects/IdCard.js'
import type { Krs } from '../value-objects/Krs.js'
import type { Nip } from '../value-objects/Nip.js'
import type { Nrb } from '../value-objects/Nrb.js'
import type { Passport } from '../value-objects/Passport.js'
import type { Pesel } from '../value-objects/Pesel.js'
import type { Regon } from '../value-objects/Regon.js'
import type { VatEu } from '../value-objects/VatEu.js'

function refine(identifier: ValidatorInterface) {
  return (val: string, ctx: RefinementCtx) => {
    const result = identifier.validate(val)
    for (const failure of result.failures) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: failure.message })
    }
  }
}

// Personal — PESEL

export const peselSchema = (strict = true) => {
  const id = Numerik.pesel(strict)
  return z.string().superRefine(refine(id))
}

export const peselParseSchema = (strict = true) => {
  const id = Numerik.pesel(strict)
  return z
    .string()
    .superRefine(refine(id))
    .transform((val): Pesel => id.parse(val))
}

// Personal — ID Card

export const idCardSchema = (strict = true) => {
  const id = Numerik.idCard(strict)
  return z.string().superRefine(refine(id))
}

export const idCardParseSchema = (strict = true) => {
  const id = Numerik.idCard(strict)
  return z
    .string()
    .superRefine(refine(id))
    .transform((val): IdCard => id.parse(val))
}

// Personal — Passport

export const passportSchema = (strict = true) => {
  const id = Numerik.passport(strict)
  return z.string().superRefine(refine(id))
}

export const passportParseSchema = (strict = true) => {
  const id = Numerik.passport(strict)
  return z
    .string()
    .superRefine(refine(id))
    .transform((val): Passport => id.parse(val))
}

// Tax & Business — NIP

export const nipSchema = (strict = true) => {
  const id = Numerik.nip(strict)
  return z.string().superRefine(refine(id))
}

export const nipParseSchema = (strict = true) => {
  const id = Numerik.nip(strict)
  return z
    .string()
    .superRefine(refine(id))
    .transform((val): Nip => id.parse(val))
}

// Tax & Business — VAT-EU

export const vatEuSchema = (strict = true) => {
  const id = Numerik.vatEu(strict)
  return z.string().superRefine(refine(id))
}

export const vatEuParseSchema = (strict = true) => {
  const id = Numerik.vatEu(strict)
  return z
    .string()
    .superRefine(refine(id))
    .transform((val): VatEu => id.parse(val))
}

// Tax & Business — REGON

export const regonSchema = (strict = true) => {
  const id = Numerik.regon(strict)
  return z.string().superRefine(refine(id))
}

export const regonParseSchema = (strict = true) => {
  const id = Numerik.regon(strict)
  return z
    .string()
    .superRefine(refine(id))
    .transform((val): Regon => id.parse(val))
}

// Tax & Business — KRS

export const krsSchema = (strict = true) => {
  const id = Numerik.krs(strict)
  return z.string().superRefine(refine(id))
}

export const krsParseSchema = (strict = true) => {
  const id = Numerik.krs(strict)
  return z
    .string()
    .superRefine(refine(id))
    .transform((val): Krs => id.parse(val))
}

// Banking — NRB

export const nrbSchema = (strict = true) => {
  const id = Numerik.nrb(strict)
  return z.string().superRefine(refine(id))
}

export const nrbParseSchema = (strict = true) => {
  const id = Numerik.nrb(strict)
  return z
    .string()
    .superRefine(refine(id))
    .transform((val): Nrb => id.parse(val))
}

// Banking — IBAN

export const ibanSchema = (strict = true) => {
  const id = Numerik.iban(strict)
  return z.string().superRefine(refine(id))
}

export const ibanParseSchema = (strict = true) => {
  const id = Numerik.iban(strict)
  return z
    .string()
    .superRefine(refine(id))
    .transform((val): Iban => id.parse(val))
}

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

function makeIdSchemas<T>(
  factory: (
    strict: boolean,
  ) => ValidatorInterface & { parse(input: string): T },
) {
  return {
    schema: (strict = true) => {
      const id = factory(strict)
      return z.string().superRefine(refine(id))
    },
    parseSchema: (strict = true) => {
      const id = factory(strict)
      return z
        .string()
        .superRefine(refine(id))
        .transform((val): T => id.parse(val))
    },
  }
}

// Personal

export const { schema: peselSchema, parseSchema: peselParseSchema } =
  makeIdSchemas<Pesel>((strict) => Numerik.pesel(strict))

export const { schema: idCardSchema, parseSchema: idCardParseSchema } =
  makeIdSchemas<IdCard>((strict) => Numerik.idCard(strict))

export const { schema: passportSchema, parseSchema: passportParseSchema } =
  makeIdSchemas<Passport>((strict) => Numerik.passport(strict))

// Tax & Business

export const { schema: nipSchema, parseSchema: nipParseSchema } =
  makeIdSchemas<Nip>((strict) => Numerik.nip(strict))

export const { schema: vatEuSchema, parseSchema: vatEuParseSchema } =
  makeIdSchemas<VatEu>((strict) => Numerik.vatEu(strict))

export const { schema: regonSchema, parseSchema: regonParseSchema } =
  makeIdSchemas<Regon>((strict) => Numerik.regon(strict))

export const { schema: krsSchema, parseSchema: krsParseSchema } =
  makeIdSchemas<Krs>((strict) => Numerik.krs(strict))

// Banking

export const { schema: nrbSchema, parseSchema: nrbParseSchema } =
  makeIdSchemas<Nrb>((strict) => Numerik.nrb(strict))

export const { schema: ibanSchema, parseSchema: ibanParseSchema } =
  makeIdSchemas<Iban>((strict) => Numerik.iban(strict))

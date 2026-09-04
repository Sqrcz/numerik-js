[🇬🇧 English](README.md) | [🇵🇱 Polski](README.pl.md)

# numerik-js

[![License](https://img.shields.io/github/license/sqrcz/numerik-js.svg)](LICENSE)
[![Tests](https://github.com/sqrcz/numerik-js/actions/workflows/tests.yml/badge.svg)](https://github.com/sqrcz/numerik-js/actions/workflows/tests.yml)
[![CodeRabbit](https://img.shields.io/coderabbit/prs/github/sqrcz/numerik-js)](https://coderabbit.ai)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@slashlab/numerik-js)](https://bundlephobia.com/package/@slashlab/numerik-js)
[![npm](https://img.shields.io/npm/v/@slashlab/numerik-js.svg)](https://www.npmjs.com/package/@slashlab/numerik-js)
[![npm downloads](https://img.shields.io/npm/dm/@slashlab/numerik-js.svg)](https://www.npmjs.com/package/@slashlab/numerik-js)

> Validate and parse Polish identification numbers — PESEL, NIP, REGON, KRS, NRB, VAT-EU, IBAN, ID Card, and Passport. Rich value objects, detailed error reasons, zero production dependencies. TypeScript-first.

JavaScript/TypeScript port of [slashlab/numerik](https://github.com/sqrcz/numerik) (PHP).

## Installation

```bash
npm install @slashlab/numerik-js
# or
pnpm add @slashlab/numerik-js
```

## Quick Start

```ts
import { Numerik } from '@slashlab/numerik-js'

// Simple boolean check
Numerik.pesel().isValid('92060512186')  // true
Numerik.nip().isValid('5260250274')     // true

// Rich validation result with failure reasons
const result = Numerik.pesel().validate('92060512185')  // wrong checksum
result.isFailed()                         // true
result.getFirstFailure().reason           // ValidationFailureReason.InvalidChecksum

// Parse to value object
const pesel = Numerik.pesel().parse('92060512186')
pesel.getBirthDate()    // Date object: 1992-06-05
pesel.getGender()       // Gender.Female
pesel.isAdult()         // true

// Try-parse (returns null on failure instead of throwing)
const parsed = Numerik.nip().tryParse('5260250274')
parsed?.getFormatted()  // '526-025-02-74'
```

## Strict mode

All identifiers accept an optional `strict` flag (default: `true`), and it never affects how input is normalized — normalization (stripping spaces, and dashes where the format allows them) is the same in both modes. What `strict` gates is extra semantic plausibility checks: rejecting all-same-digit numbers (PESEL, NIP, KRS, VAT-EU) and future birth dates (PESEL). ID Card, Passport, REGON, NRB, and IBAN have no additional strict-mode checks.

```ts
Numerik.nip(false).isValid('1111111111')  // true
Numerik.nip(true).isValid('1111111111')   // false — all-same-digit
```

## Zod integration

```ts
import { peselSchema, nipParseSchema } from '@slashlab/numerik-js/zod'
import { z } from 'zod'

const schema = z.object({
  pesel: peselSchema(),           // validates, keeps string
  nip: nipParseSchema(),          // validates and transforms to Nip value object
})
```

## Supported identifiers

| Group    | Identifier | Class                |
| -------- | ---------- | -------------------- |
| Personal | PESEL      | `PeselIdentifier`    |
| Personal | ID Card    | `IdCardIdentifier`   |
| Personal | Passport   | `PassportIdentifier` |
| Tax      | NIP        | `NipIdentifier`      |
| Tax      | VAT-EU     | `VatEuIdentifier`    |
| Business | REGON      | `RegonIdentifier`    |
| Business | KRS        | `KrsIdentifier`      |
| Banking  | NRB        | `NrbIdentifier`      |
| Banking  | IBAN       | `IbanIdentifier`     |

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Security

See [SECURITY.md](SECURITY.md).

## License

MIT — see [LICENSE](LICENSE).

---

If this saved you time → [☕ Buy me a coffee](https://buymeacoffee.com/sqrcz)

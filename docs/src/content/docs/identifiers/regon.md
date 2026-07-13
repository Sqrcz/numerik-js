---
title: REGON
description: Validate and parse Polish REGON business registry numbers — both 9-digit and 14-digit — with @slashlab/numerik-js.
---

REGON (*Rejestr Gospodarki Narodowej*) is Poland's business registry identifier. It exists in two forms:

- **9 digits** — for individual entities (sole traders, natural persons).
- **14 digits** — for legal entities with local units (the first 9 digits are the base REGON, the last 5 identify the local unit).

## Usage

```ts
import { Numerik } from '@slashlab/numerik-js'

// Boolean
Numerik.regon().isValid('850518457')        // true (9-digit)
Numerik.regon().isValid('85051845749370')   // true (14-digit)

// Rich result
const result = Numerik.regon().validate('850518457')
result.isValid   // true

// Parse to value object
const regon = Numerik.regon().parse('850518457')

// Null on failure instead of exception
const maybe = Numerik.regon().tryParse('bad-input') // null
```

## Value object API

`parse()` and `tryParse()` return a `Regon` instance.

### Core

| Method | Return type | Description |
|--------|-------------|-------------|
| `getRaw()` | `string` | The original input, untouched. |
| `getNormalized()` | `string` | Whitespace-stripped digits. |
| `toString()` | `string` | Alias for `getNormalized()`. |

### Type & structure

| Method | Return type | Description |
|--------|-------------|-------------|
| `getType()` | `RegonType` | `RegonType.Individual` (9-digit) or `RegonType.LegalEntity` (14-digit). |
| `getBaseRegon()` | `string` | First 9 digits — always present for both types. |
| `getLocalUnitSuffix()` | `string \| null` | Last 5 digits for 14-digit numbers; `null` for 9-digit. |
| `isLocalUnit()` | `boolean` | `true` for 14-digit (legal entity with local unit). |

## Examples

```ts
import { Numerik, RegonType } from '@slashlab/numerik-js'

// 9-digit REGON
const regon = Numerik.regon().parse('850518457')

regon.getType()              // RegonType.Individual
regon.getBaseRegon()         // '850518457'
regon.getLocalUnitSuffix()   // null
regon.isLocalUnit()          // false

// 14-digit REGON
const regon14 = Numerik.regon().parse('85051845749370')

regon14.getType()             // RegonType.LegalEntity
regon14.getBaseRegon()        // '850518457'
regon14.getLocalUnitSuffix()  // '49370'
regon14.isLocalUnit()         // true
```

## Failure reasons

| Reason | Value | When |
|--------|-------|------|
| `InvalidLength` | `invalid_length` | Input is not exactly 9 or 14 digits after normalisation. |
| `InvalidCharacters` | `invalid_characters` | Non-digit characters remain after stripping whitespace. |
| `InvalidChecksum` | `invalid_checksum` | Checksum digit does not match. For 14-digit, can refer to either the base 9-digit check or the full 14-digit check. |

## Validation algorithm

**9-digit weights:** `8, 9, 2, 3, 4, 5, 6, 7`

**14-digit weights:** `2, 4, 8, 5, 0, 9, 7, 3, 6, 1, 2, 4, 8`

**9-digit validation:**
1. Strip whitespace. Assert exactly 9 digits.
2. Multiply the first 8 digits by the 9-digit weights, sum, take `mod 11`. If the result is `10`, the checksum digit must be `0`. Otherwise the result must equal digit 9.

**14-digit validation:**
1. Strip whitespace. Assert exactly 14 digits.
2. Validate the first 9 digits as a standalone 9-digit REGON.
3. Multiply all 13 significant digits by the 14-digit weights, sum, take `mod 11`. If the result is `10`, checksum digit must be `0`. Otherwise the result must equal digit 14.

See [Algorithms](/guide/algorithms/) for the full reference.

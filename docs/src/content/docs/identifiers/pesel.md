---
title: PESEL
description: Validate and parse Polish PESEL numbers with @slashlab/numerik-js. Extracts birth date, gender, age, century, and ordinal number.
---

PESEL (*Powszechny Elektroniczny System Ewidencji Ludności*) is Poland's universal 11-digit citizen identifier. It encodes the holder's birth date, birth century, gender, and an ordinal serial number.

## Usage

```ts
import { Numerik } from '@slashlab/numerik-js'

// Boolean
Numerik.pesel().isValid('92060512186')   // true

// Rich result
const result = Numerik.pesel().validate('92060512186')
result.isValid   // true

// Parse to value object
const pesel = Numerik.pesel().parse('92060512186')

// Null on failure instead of exception
const maybe = Numerik.pesel().tryParse('bad-input') // null
```

## Value object API

`parse()` and `tryParse()` return a `Pesel` instance.

### Core

| Method | Return type | Description |
|--------|-------------|-------------|
| `getRaw()` | `string` | The original input, untouched. |
| `getNormalized()` | `string` | Whitespace-stripped digits. |
| `toString()` | `string` | Alias for `getNormalized()`. |

### Extracted data

| Method | Return type | Description |
|--------|-------------|-------------|
| `getBirthDate()` | `Date` | Birth date decoded from the PESEL. Returns a new `Date` object, decoupled from the original. |
| `getGender()` | `Gender` | `Gender.Male` or `Gender.Female`. |
| `getOrdinalNumber()` | `number` | The 4-digit ordinal serial (digits 7–10). The last digit also encodes gender: odd = male, even = female. |
| `getCentury()` | `number` | The birth century as a base year, e.g. `1900`, `2000`, `2100`. |

### Utility

| Method | Return type | Description |
|--------|-------------|-------------|
| `isMale()` | `boolean` | `true` when gender is `Gender.Male`. |
| `isFemale()` | `boolean` | `true` when gender is `Gender.Female`. |
| `getAge()` | `number` | Full years elapsed from birth date to today. |
| `isAdult()` | `boolean` | `true` when `getAge() >= 18`. |

## Examples

```ts
import { Numerik, Gender } from '@slashlab/numerik-js'

const pesel = Numerik.pesel().parse('92060512186')

pesel.getRaw()           // '92060512186'
pesel.getNormalized()    // '92060512186'
pesel.getBirthDate()     // Date — 1992-06-05
pesel.getGender()        // Gender.Female
pesel.isFemale()         // true
pesel.getOrdinalNumber() // 1218 (digits 7–10)
pesel.getCentury()       // 1900
pesel.getAge()           // calculated from today
pesel.isAdult()          // true
```

## Century encoding

The month digits in a PESEL encode both the real month and the birth century:

| Stored month range | Real month | Birth century |
|--------------------|-----------|---------------|
| 01–12 | 01–12 | 1900–1999 |
| 21–32 | 01–12 | 2000–2099 |
| 41–52 | 01–12 | 2100–2199 |
| 61–72 | 01–12 | 2200–2299 |
| 81–92 | 01–12 | 1800–1899 |

## Failure reasons

| Reason | Value | When |
|--------|-------|------|
| `InvalidLength` | `invalid_length` | Input is not exactly 11 digits after normalisation. |
| `InvalidCharacters` | `invalid_characters` | Non-digit characters remain after stripping whitespace. |
| `InvalidMonth` | `invalid_month` | Month encoding does not match any known century range. |
| `InvalidDate` | `invalid_date` | The decoded date is not a real calendar date. |
| `FutureDate` | `future_date` | The decoded birth date is in the future (strict mode only). |
| `InvalidChecksum` | `invalid_checksum` | Checksum digit does not match the computed value. |
| `AllSameDigit` | `all_same_digit` | All 11 digits are identical (strict mode only). |

## Validation algorithm

Weights: `1, 3, 7, 9, 1, 3, 7, 9, 1, 3`

1. Reject inputs longer than 32 characters. Strip whitespace. Assert exactly 11 digits.
2. Decode birth date using the century encoding table above. Assert the date is a real calendar date. In strict mode, also reject birth dates in the future.
3. Compute checksum: multiply each of the first 10 digits by its weight, sum the products, take `mod 10`, subtract from `10`, take `mod 10` again. The result must equal digit 11.
4. In strict mode, reject inputs where all 11 digits are identical.

See [Algorithms](/guide/algorithms/) for the full reference.

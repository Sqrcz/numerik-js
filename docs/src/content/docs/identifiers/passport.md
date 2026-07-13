---
title: Passport
description: Validate and parse Polish passport numbers with @slashlab/numerik-js.
---

The Polish passport number is a 9-character alphanumeric identifier consisting of a 2-letter series, a 6-digit sequential number, and a check digit validated using the ICAO 9303 weighted checksum — the same algorithm used in travel documents globally.

## Usage

```ts
import { Numerik } from '@slashlab/numerik-js'

// Boolean
Numerik.passport().isValid('AB1234564')   // true

// Rich result
const result = Numerik.passport().validate('AB1234564')
result.isValid   // true

// Parse to value object
const passport = Numerik.passport().parse('AB1234564')

// Null on failure instead of exception
const maybe = Numerik.passport().tryParse('bad-input') // null
```

Input is normalised to uppercase; spaces and hyphens are stripped:

```ts
Numerik.passport().isValid('ab 123456 4')   // true
Numerik.passport().isValid('ab-123456-4')   // true
```

## Value object API

`parse()` and `tryParse()` return a `Passport` instance.

### Core

| Method | Return type | Description |
|--------|-------------|-------------|
| `getRaw()` | `string` | The original input, untouched. |
| `getNormalized()` | `string` | Uppercased, spaces and hyphens removed. |
| `toString()` | `string` | Alias for `getNormalized()`. |

### Structure

| Method | Return type | Description |
|--------|-------------|-------------|
| `getSeries()` | `string` | First 2 characters (letter series), e.g. `AB`. |
| `getSequentialNumber()` | `string` | Characters 2–7 (6 digits), e.g. `123456`. |
| `getCheckDigit()` | `string` | Character 8 (check digit), e.g. `4`. |

## Examples

```ts
const passport = Numerik.passport().parse('AB1234564')

passport.getRaw()                // 'AB1234564'
passport.getNormalized()         // 'AB1234564'
passport.getSeries()             // 'AB'
passport.getSequentialNumber()   // '123456'
passport.getCheckDigit()         // '4'

// Lowercase input
const passport2 = Numerik.passport().parse('ab1234564')
passport2.getRaw()               // 'ab1234564'
passport2.getNormalized()        // 'AB1234564'
```

## Failure reasons

| Reason | Value | When |
|--------|-------|------|
| `InvalidLength` | `invalid_length` | Input is not exactly 9 characters after normalisation. |
| `InvalidCharacters` | `invalid_characters` | Positions 0–1 contain non-letter characters, or positions 2–8 contain non-digit characters. |
| `InvalidChecksum` | `invalid_checksum` | ICAO 9303 check digit does not match. |

## Validation algorithm

Uses the **ICAO 9303** weighted checksum. Weights `[7, 3, 1]` repeat cyclically over the first 8 characters. Digits map to their face value (0–9); letters map to `A=10` through `Z=35`. The check digit equals the weighted sum modulo 10.

1. Reject inputs longer than 32 characters. Strip spaces and hyphens, convert to uppercase.
2. Assert exactly 9 characters remain.
3. Assert positions 0–1 are alphabetic letters.
4. Assert positions 2–8 are digits.
5. Compute the ICAO 9303 checksum over positions 0–7. The result must equal digit at position 8.

See [Algorithms](/guide/algorithms/#icao-9303) for the full ICAO 9303 reference.

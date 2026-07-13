---
title: ID Card
description: Validate and parse Polish national identity card numbers (dowód osobisty) with @slashlab/numerik-js.
---

The Polish national identity card (*dowód osobisty*) number is a 9-character alphanumeric identifier consisting of a 3-letter series, a 5-digit sequential number, and a check digit validated using the ICAO 9303 weighted checksum.

## Usage

```ts
import { Numerik } from '@slashlab/numerik-js'

// Boolean
Numerik.idCard().isValid('ABC123454')   // true

// Rich result
const result = Numerik.idCard().validate('ABC123454')
result.isValid   // true

// Parse to value object
const idCard = Numerik.idCard().parse('ABC123454')

// Null on failure instead of exception
const maybe = Numerik.idCard().tryParse('bad-input') // null
```

Input is normalised to uppercase; spaces and hyphens are stripped:

```ts
Numerik.idCard().isValid('abc 123 454')   // true
Numerik.idCard().isValid('abc-123-454')   // true
```

## Value object API

`parse()` and `tryParse()` return an `IdCard` instance.

### Core

| Method | Return type | Description |
|--------|-------------|-------------|
| `getRaw()` | `string` | The original input, untouched. |
| `getNormalized()` | `string` | Uppercased, spaces and hyphens removed. |
| `toString()` | `string` | Alias for `getNormalized()`. |

### Structure

| Method | Return type | Description |
|--------|-------------|-------------|
| `getSeries()` | `string` | First 3 characters (letter series), e.g. `ABC`. |
| `getSequentialNumber()` | `string` | Characters 3–7 (5 digits), e.g. `12345`. |
| `getCheckDigit()` | `string` | Character 8 (check digit), e.g. `4`. |

## Examples

```ts
const idCard = Numerik.idCard().parse('ABC123454')

idCard.getRaw()                // 'ABC123454'
idCard.getNormalized()         // 'ABC123454'
idCard.getSeries()             // 'ABC'
idCard.getSequentialNumber()   // '12345'
idCard.getCheckDigit()         // '4'

// Lowercase + hyphenated input
const idCard2 = Numerik.idCard().parse('abc-123-454')
idCard2.getRaw()               // 'abc-123-454'
idCard2.getNormalized()        // 'ABC123454'
```

## Failure reasons

| Reason | Value | When |
|--------|-------|------|
| `InvalidLength` | `invalid_length` | Input is not exactly 9 characters after normalisation. |
| `InvalidCharacters` | `invalid_characters` | Positions 0–2 contain non-letter characters, or positions 3–8 contain non-digit characters. |
| `InvalidFormat` | `invalid_format` | Series letters contain `O` or `Q` (excluded from the ID card series alphabet). |
| `InvalidChecksum` | `invalid_checksum` | ICAO 9303 check digit does not match. |

## Validation algorithm

Uses the **ICAO 9303** weighted checksum. Weights `[7, 3, 1]` repeat cyclically over the first 8 characters. Digits map to their face value (0–9); letters map to `A=10` through `Z=35`. The check digit equals the weighted sum modulo 10.

1. Reject inputs longer than 32 characters. Strip spaces and hyphens, convert to uppercase.
2. Assert exactly 9 characters remain.
3. Assert positions 0–2 are alphabetic letters.
4. Assert positions 0–2 do not contain `O` or `Q`.
5. Assert positions 3–8 are digits.
6. Compute the ICAO 9303 checksum over positions 0–7. The result must equal digit at position 8.

See [Algorithms](/guide/algorithms/#icao-9303) for the full ICAO 9303 reference.

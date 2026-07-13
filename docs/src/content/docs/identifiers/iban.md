---
title: IBAN
description: Validate and parse Polish IBAN bank account numbers with @slashlab/numerik-js.
---

The Polish IBAN (*International Bank Account Number*) is the `PL`-prefixed form of the NRB. It is 28 characters long: the 2-letter country code `PL` followed by the 26-digit NRB.

## Usage

```ts
import { Numerik } from '@slashlab/numerik-js'

// Boolean
Numerik.iban().isValid('PL61102010260000000000000000')   // true

// Spaced format is accepted
Numerik.iban().isValid('PL61 1020 1026 0000 0000 0000 0000')   // true

// Rich result
const result = Numerik.iban().validate('PL61102010260000000000000000')
result.isValid   // true

// Parse to value object
const iban = Numerik.iban().parse('PL61102010260000000000000000')

// Null on failure instead of exception
const maybe = Numerik.iban().tryParse('bad-input') // null
```

## Value object API

`parse()` and `tryParse()` return an `Iban` instance.

### Core

| Method | Return type | Description |
|--------|-------------|-------------|
| `getRaw()` | `string` | The original input, untouched. |
| `getNormalized()` | `string` | `PL` + 26 digits (spaces stripped). |
| `toString()` | `string` | Alias for `getNormalized()`. |

### Formatting

| Method | Return type | Description |
|--------|-------------|-------------|
| `getFormatted()` | `string` | Human-readable IBAN: `PLCC NNNN NNNN NNNN NNNN NNNN NNNN`. |

### Structure

| Method | Return type | Description |
|--------|-------------|-------------|
| `getCountryCode()` | `string` | Always `'PL'`. |
| `getNrb()` | `string` | The 26-digit NRB portion (without `PL` prefix). |
| `getCheckDigits()` | `string` | Characters 2–3 (2 digits after the country code) — MOD-97 check digits. |
| `getSortCode()` | `string` | Digits 4–11 of the IBAN (8 digits) — bank sort code. |
| `getBankCode()` | `string` | Digits 4–6 of the IBAN (3 digits) — bank identifier. |
| `getAccountNumber()` | `string` | Digits 12–27 of the IBAN (16 digits) — customer account number. |

## Examples

```ts
const iban = Numerik.iban().parse('PL61102010260000000000000000')

iban.getRaw()              // 'PL61102010260000000000000000'
iban.getNormalized()       // 'PL61102010260000000000000000'
iban.getFormatted()        // 'PL61 1020 1026 0000 0000 0000 0000'
iban.getCountryCode()      // 'PL'
iban.getNrb()              // '61102010260000000000000000'
iban.getCheckDigits()      // '61'
iban.getSortCode()         // '10201026'
iban.getBankCode()         // '102'
iban.getAccountNumber()    // '0000000000000000'
```

## Failure reasons

| Reason | Value | When |
|--------|-------|------|
| `InvalidLength` | `invalid_length` | Input is not exactly 28 characters (2 + 26 digits) after normalisation. |
| `InvalidCharacters` | `invalid_characters` | Characters other than `PL`, digits, and spaces are present. |
| `InvalidFormat` | `invalid_format` | Missing or incorrect `PL` country prefix. |
| `InvalidChecksum` | `invalid_checksum` | MOD-97 check digit does not match. |

## Validation algorithm

Uses the **MOD-97** algorithm from ISO 13616:

1. Reject inputs longer than 40 characters. Strip spaces and hyphens. Assert the `PL` prefix is present.
2. Assert exactly 28 characters remain (`PL` + 26 digits).
3. Rearrange: move the first 4 characters (`PL` + 2 check digits) to the end and replace the country code with its numeric equivalent (`PL` = `2521`), giving a 30-digit string.
4. Compute the 30-digit string modulo 97. The result must equal `1`.

See [Algorithms](/guide/algorithms/#nrb) for the full NRB MOD-97 reference.

## Related

- [NRB](/identifiers/nrb/) — the domestic (non-prefixed) form of this account number.

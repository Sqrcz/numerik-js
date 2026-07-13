---
title: NRB
description: Validate and parse Polish NRB bank account numbers with @slashlab/numerik-js.
---

NRB (*Numer Rachunku Bankowego*) is Poland's 26-digit domestic bank account number, verified using the MOD-97 checksum from the IBAN standard. An NRB is structurally the numeric portion of a Polish IBAN (i.e. the IBAN without the `PL` prefix).

## Usage

```ts
import { Numerik } from '@slashlab/numerik-js'

// Boolean
Numerik.nrb().isValid('61102010260000000000000000')   // true

// Spaced format is accepted
Numerik.nrb().isValid('61 1020 1026 0000 0000 0000 0000')   // true

// IBAN-prefixed format is also accepted
Numerik.nrb().isValid('PL61102010260000000000000000')   // true

// Rich result
const result = Numerik.nrb().validate('61102010260000000000000000')
result.isValid   // true

// Parse to value object
const nrb = Numerik.nrb().parse('61102010260000000000000000')

// Null on failure instead of exception
const maybe = Numerik.nrb().tryParse('bad-input') // null
```

## Value object API

`parse()` and `tryParse()` return an `Nrb` instance.

### Core

| Method | Return type | Description |
|--------|-------------|-------------|
| `getRaw()` | `string` | The original input, untouched. |
| `getNormalized()` | `string` | 26 raw digits (prefix and spaces stripped). |
| `toString()` | `string` | Alias for `getNormalized()`. |

### Formatting

| Method | Return type | Description |
|--------|-------------|-------------|
| `getFormatted()` | `string` | Human-readable form: `CC NNNN NNNN NNNN NNNN NNNN NNNN`. |
| `getIban()` | `string` | Full Polish IBAN: `PL` + 26 digits. |
| `getFormattedIban()` | `string` | Human-readable IBAN: `PLCC NNNN NNNN NNNN NNNN NNNN NNNN`. |

### Structure

| Method | Return type | Description |
|--------|-------------|-------------|
| `getCheckDigits()` | `string` | First 2 digits — MOD-97 check digits. |
| `getSortCode()` | `string` | Digits 2–9 (8 digits) — bank sort code. |
| `getBankCode()` | `string` | Digits 2–4 (3 digits) — bank identifier. |
| `getAccountNumber()` | `string` | Digits 10–25 (16 digits) — customer account number. |

## Examples

```ts
const nrb = Numerik.nrb().parse('61102010260000000000000000')

nrb.getRaw()              // '61102010260000000000000000'
nrb.getNormalized()       // '61102010260000000000000000'
nrb.getFormatted()        // '61 1020 1026 0000 0000 0000 0000'
nrb.getIban()             // 'PL61102010260000000000000000'
nrb.getFormattedIban()    // 'PL61 1020 1026 0000 0000 0000 0000'
nrb.getCheckDigits()      // '61'
nrb.getSortCode()         // '10201026'
nrb.getBankCode()         // '102'
nrb.getAccountNumber()    // '0000000000000000'
```

## Failure reasons

| Reason | Value | When |
|--------|-------|------|
| `InvalidLength` | `invalid_length` | Input is not exactly 26 digits after normalisation. |
| `InvalidCharacters` | `invalid_characters` | Characters other than digits, spaces, and an optional `PL` prefix are present. |
| `InvalidChecksum` | `invalid_checksum` | MOD-97 check digit does not match. |

## Validation algorithm

Uses the **MOD-97** algorithm from ISO 13616 (IBAN standard):

1. Reject inputs longer than 40 characters. Strip spaces and hyphens, and an optional `PL` prefix.
2. Assert exactly 26 digits remain.
3. Rearrange: move the first 2 digits (the check digits) to the end and insert the numeric country code for Poland (`2521`) between the remaining 24 digits and them, giving a 30-digit string.
4. Compute the 30-digit string modulo 97. The result must equal `1`.

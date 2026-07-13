---
title: VAT-EU
description: Validate and parse Polish EU VAT numbers with @slashlab/numerik-js.
---

The Polish EU VAT number (*Numer VAT UE*) is Poland's NIP prefixed with the country code `PL`, used for intra-EU transactions. Validation strips the prefix and applies the standard NIP MOD-11 algorithm.

## Usage

```ts
import { Numerik } from '@slashlab/numerik-js'

// Boolean
Numerik.vatEu().isValid('PL5260250274')   // true

// Rich result
const result = Numerik.vatEu().validate('PL5260250274')
result.isValid   // true

// Parse to value object
const vatEu = Numerik.vatEu().parse('PL5260250274')

// Null on failure instead of exception
const maybe = Numerik.vatEu().tryParse('bad-input') // null
```

Separators in the NIP portion are accepted:

```ts
Numerik.vatEu().isValid('PL526-025-02-74')   // true
```

## Value object API

`parse()` and `tryParse()` return a `VatEu` instance.

### Core

| Method | Return type | Description |
|--------|-------------|-------------|
| `getRaw()` | `string` | The original input, untouched. |
| `getNormalized()` | `string` | `PL` prefix followed by 10 raw digits. |
| `toString()` | `string` | Alias for `getNormalized()`. |

### Extracted data

| Method | Return type | Description |
|--------|-------------|-------------|
| `getCountryCode()` | `string` | Always `'PL'`. |
| `getNip()` | `string` | The 10-digit NIP portion (without prefix). |
| `getFormatted()` | `string` | `PL` + canonical `NNN-NNN-NN-NN` display form. |

## Examples

```ts
const vatEu = Numerik.vatEu().parse('PL5260250274')

vatEu.getRaw()            // 'PL5260250274'
vatEu.getNormalized()     // 'PL5260250274'
vatEu.getCountryCode()    // 'PL'
vatEu.getNip()            // '5260250274'
vatEu.getFormatted()      // 'PL526-025-02-74'
```

## Failure reasons

| Reason | Value | When |
|--------|-------|------|
| `InvalidLength` | `invalid_length` | Input does not produce exactly 10 NIP digits after stripping the prefix and separators. |
| `InvalidCharacters` | `invalid_characters` | Characters other than `PL`, digits, hyphens, and spaces are present. |
| `InvalidFormat` | `invalid_format` | Missing `PL` prefix, or first 3 NIP digits are `000`. |
| `InvalidChecksum` | `invalid_checksum` | NIP checksum digit does not match. |
| `AllSameDigit` | `all_same_digit` | All 10 NIP digits are identical — strict mode only. |

## Validation algorithm

1. Assert the input begins with `PL` (case-insensitive).
2. Strip the `PL` prefix, then strip hyphens and spaces from the remaining digits.
3. Apply the full [NIP](/identifiers/nip/) validation algorithm to the remaining 10 digits.

See [Algorithms](/guide/algorithms/#nip) for the full NIP reference.

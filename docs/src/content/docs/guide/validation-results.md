---
title: Validation Results
description: Understanding the ValidationResult and ValidationFailure classes returned by numerik-js validators.
---

Every identifier class (e.g. `PeselIdentifier`) exposes the same two methods: `isValid()` and `validate()`. Neither ever throws.

## ValidationResult

`validate()` returns a `ValidationResult` instance.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `isValid` | `boolean` | `true` when validation passed. |
| `failures` | `readonly ValidationFailure[]` | Empty array on success; one or more failures on failure. |

### Methods

| Method | Return type | Description |
|--------|-------------|-------------|
| `isFailed()` | `boolean` | Inverse of `isValid`. |
| `getFailures()` | `readonly ValidationFailure[]` | Returns the failures array. |
| `getFirstFailure()` | `ValidationFailure \| null` | First failure, or `null` if valid. |
| `hasFailureReason(reason: ValidationFailureReason)` | `boolean` | `true` if any failure matches the given reason. |

### Examples

```ts
import { Numerik, ValidationFailureReason } from '@slashlab/numerik-js'

// Passing result
const result = Numerik.pesel().validate('92060512186')

result.isValid            // true
result.isFailed()         // false
result.failures           // []
result.getFirstFailure()  // null

// Failing result
const failed = Numerik.nip().validate('0000000000')

failed.isValid     // false
failed.isFailed()  // true

// Inspect the first (and usually only) failure
const failure = failed.getFirstFailure()
failure?.reason    // ValidationFailureReason.InvalidFormat
failure?.message   // 'NIP tax office code cannot be 000.'

// Check for a specific reason
failed.hasFailureReason(ValidationFailureReason.InvalidChecksum)  // false
failed.hasFailureReason(ValidationFailureReason.InvalidFormat)    // true
```

## ValidationFailure

Each item in `failures` is a `ValidationFailure` instance.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `reason` | `ValidationFailureReason` | Enum value identifying the failure category. |
| `message` | `string` | Human-readable description in English. |

## ValidationFailureReason enum

### Format failures

| Value | Raw value | Description |
|-------|-----------|-------------|
| `InvalidLength` | `invalid_length` | Input has the wrong number of digits. |
| `InvalidCharacters` | `invalid_characters` | Unexpected characters are present after stripping allowed separators. |
| `InvalidFormat` | `invalid_format` | Correct length and characters, but a structural rule is violated (e.g. NIP tax office code `000`). |

### Checksum failures

| Value | Raw value | Description |
|-------|-----------|-------------|
| `InvalidChecksum` | `invalid_checksum` | The computed checksum does not match the checksum digit. |

### Encoded-data failures

| Value | Raw value | Description |
|-------|-----------|-------------|
| `InvalidDate` | `invalid_date` | The date encoded inside the identifier is not a real calendar date. |
| `FutureDate` | `future_date` | The encoded birth date is in the future. |
| `InvalidMonth` | `invalid_month` | The month encoding does not correspond to any known century range. |

### Semantic failures

| Value | Raw value | Description |
|-------|-----------|-------------|
| `AllZeros` | `all_zeros` | All digits are zero — structurally plausible but semantically invalid. |
| `AllSameDigit` | `all_same_digit` | All digits are the same non-zero value. |

## Static factory methods

`ValidationResult` exposes three static constructors used internally and in tests:

```ts
import { ValidationResult, ValidationFailure, ValidationFailureReason } from '@slashlab/numerik-js'

// Success
ValidationResult.pass()

// Failure with a list of failures
ValidationResult.fail([
  new ValidationFailure(ValidationFailureReason.InvalidChecksum, 'Checksum mismatch.'),
])

// Failure with a single reason — shorthand
ValidationResult.failWithReason(
  ValidationFailureReason.InvalidLength,
  'Expected 11 digits, got 10.',
)
```

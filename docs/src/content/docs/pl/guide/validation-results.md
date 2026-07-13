---
title: Wyniki walidacji
description: Zrozumienie klas ValidationResult i ValidationFailure zwracanych przez walidatory numerik-js.
---

Metody `isValid()` i `validate()` są dostępne na każdej klasie identyfikatora i nigdy nie rzucają wyjątku.

## ValidationResult

`validate()` zwraca instancję `ValidationResult`.

### Właściwości

| Właściwość | Typ | Opis |
|-----------|-----|------|
| `isValid` | `boolean` | `true` jeśli walidacja zakończyła się sukcesem. |
| `failures` | `readonly ValidationFailure[]` | Pusta tablica przy poprawnym numerze; jeden lub więcej błędów przy nieprawidłowym. |

### Metody

| Metoda | Typ zwracany | Opis |
|--------|-------------|------|
| `isFailed()` | `boolean` | Negacja `isValid`. |
| `getFailures()` | `readonly ValidationFailure[]` | Zwraca tablicę błędów. |
| `getFirstFailure()` | `ValidationFailure \| null` | Pierwszy błąd lub `null` przy poprawnym wejściu. |
| `hasFailureReason(reason: ValidationFailureReason)` | `boolean` | `true` jeśli którykolwiek błąd pasuje do podanego powodu. |

### Przykłady

```ts
import { Numerik, ValidationFailureReason } from '@slashlab/numerik-js'

// Wynik pozytywny
const result = Numerik.pesel().validate('92060512186')

result.isValid            // true
result.isFailed()         // false
result.failures           // []
result.getFirstFailure()  // null

// Wynik negatywny
const failed = Numerik.nip().validate('0000000000')

failed.isValid     // false
failed.isFailed()  // true

// Sprawdź pierwszy (i zazwyczaj jedyny) błąd
const failure = failed.getFirstFailure()
failure?.reason    // ValidationFailureReason.InvalidFormat
failure?.message   // 'NIP tax office code cannot be 000.'

// Sprawdź konkretny powód
failed.hasFailureReason(ValidationFailureReason.InvalidChecksum)  // false
failed.hasFailureReason(ValidationFailureReason.InvalidFormat)    // true
```

## ValidationFailure

Każdy element w `failures` to instancja `ValidationFailure`.

### Właściwości

| Właściwość | Typ | Opis |
|-----------|-----|------|
| `reason` | `ValidationFailureReason` | Wartość enum identyfikująca kategorię błędu. |
| `message` | `string` | Opis błędu przeznaczony do logowania i debugowania. |

## Enum ValidationFailureReason

`ValidationFailureReason` to enum, którego wartości są ciągami znaków.

### Błędy formatu

| Przypadek | Wartość | Opis |
|-----------|---------|------|
| `InvalidLength` | `invalid_length` | Numer ma nieprawidłową liczbę cyfr. |
| `InvalidCharacters` | `invalid_characters` | Po usunięciu dozwolonych separatorów pozostały niedozwolone znaki. |
| `InvalidFormat` | `invalid_format` | Długość i znaki są poprawne, ale numer narusza regułę strukturalną (np. kod urzędu skarbowego NIP `000`). |

### Błędy sumy kontrolnej

| Przypadek | Wartość | Opis |
|-----------|---------|------|
| `InvalidChecksum` | `invalid_checksum` | Obliczona suma kontrolna nie zgadza się z cyfrą kontrolną. |

### Błędy zakodowanej daty

| Przypadek | Wartość | Opis |
|-----------|---------|------|
| `InvalidDate` | `invalid_date` | Data zakodowana w identyfikatorze nie istnieje w kalendarzu. |
| `FutureDate` | `future_date` | Zakodowana data urodzenia jest w przyszłości. |
| `InvalidMonth` | `invalid_month` | Kodowanie miesiąca nie odpowiada żadnemu ze znanych zakresów stulecia. |

### Błędy semantyczne

| Przypadek | Wartość | Opis |
|-----------|---------|------|
| `AllZeros` | `all_zeros` | Wszystkie cyfry są zerami — strukturalnie możliwe, ale semantycznie nieprawidłowe. |
| `AllSameDigit` | `all_same_digit` | Wszystkie cyfry są takie same i niezerowe. |

## Pomocnicze konstruktory

`ValidationResult` udostępnia trzy statyczne konstruktory przydatne przy pisaniu testów:

```ts
import { ValidationResult, ValidationFailure, ValidationFailureReason } from '@slashlab/numerik-js'

// Sukces
ValidationResult.pass()

// Niepowodzenie z listą błędów
ValidationResult.fail([
  new ValidationFailure(ValidationFailureReason.InvalidChecksum, 'Checksum mismatch.'),
])

// Niepowodzenie z jednym powodem — skrócona forma
ValidationResult.failWithReason(
  ValidationFailureReason.InvalidLength,
  'Expected 11 digits, got 10.',
)
```

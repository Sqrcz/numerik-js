---
title: VAT-EU
description: Waliduj i parsuj polskie numery VAT-EU z @slashlab/numerik-js.
---

Polski numer VAT UE (*Numer VAT UE*) to polski NIP poprzedzony kodem kraju `PL`, używany w transakcjach wewnątrzunijnych. Walidacja usuwa prefiks i stosuje standardowy algorytm MOD-11 dla NIP.

## Użycie

```ts
import { Numerik } from '@slashlab/numerik-js'

// Szybkie sprawdzenie
Numerik.vatEu().isValid('PL5260250274')   // true

// Pełny obiekt z danymi
const result = Numerik.vatEu().validate('PL5260250274')
result.isValid   // true

// Parsowanie do obiektu z danymi
const vatEu = Numerik.vatEu().parse('PL5260250274')

// Null zamiast wyjątku w przypadku błędu
const maybe = Numerik.vatEu().tryParse('bad-input') // null
```

Separatory w części NIP są akceptowane:

```ts
Numerik.vatEu().isValid('PL526-025-02-74')   // true
```

## Metody zwracanego obiektu

`parse()` i `tryParse()` zwracają instancję `VatEu`.

### Podstawowe

| Metoda | Typ zwracany | Opis |
|--------|-------------|------|
| `getRaw()` | `string` | Oryginalne dane wejściowe, bez zmian. |
| `getNormalized()` | `string` | Prefiks `PL`, po którym następuje 10 cyfr. |
| `toString()` | `string` | Alias dla `getNormalized()`. |

### Wyodrębnione dane

| Metoda | Typ zwracany | Opis |
|--------|-------------|------|
| `getCountryCode()` | `string` | Zawsze `'PL'`. |
| `getNip()` | `string` | 10-cyfrowa część NIP (bez prefiksu). |
| `getFormatted()` | `string` | `PL` + kanoniczna postać wyświetlania `NNN-NNN-NN-NN`. |

## Przykłady

```ts
const vatEu = Numerik.vatEu().parse('PL5260250274')

vatEu.getRaw()            // 'PL5260250274'
vatEu.getNormalized()     // 'PL5260250274'
vatEu.getCountryCode()    // 'PL'
vatEu.getNip()            // '5260250274'
vatEu.getFormatted()      // 'PL526-025-02-74'
```

## Powody błędów

| Powód | Wartość | Warunek |
|-------|---------|-------|
| `InvalidLength` | `invalid_length` | Dane wejściowe nie dają dokładnie 10 cyfr NIP po usunięciu prefiksu i separatorów. |
| `InvalidCharacters` | `invalid_characters` | Obecne są znaki inne niż `PL`, cyfry, myślniki i spacje. |
| `InvalidFormat` | `invalid_format` | Brakujący prefiks `PL` lub pierwsze 3 cyfry NIP to `000`. |
| `InvalidChecksum` | `invalid_checksum` | Cyfra kontrolna NIP nie zgadza się. |
| `AllSameDigit` | `all_same_digit` | Wszystkie 10 cyfr NIP jest identycznych — tylko tryb ścisły. |

## Algorytm walidacji

1. Sprawdź, czy dane wejściowe zaczynają się od `PL` (bez rozróżniania wielkości liter).
2. Usuń prefiks `PL`, następnie usuń myślniki i spacje z pozostałych cyfr.
3. Zastosuj pełny algorytm walidacji [NIP](/pl/identifiers/nip/) do pozostałych 10 cyfr.

Pełna dokumentacja algorytmu NIP w sekcji [Algorytmy](/pl/guide/algorithms/#nip).

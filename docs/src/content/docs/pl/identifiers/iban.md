---
title: IBAN
description: Waliduj i parsuj polskie numery IBAN z @slashlab/numerik-js.
---

Polski IBAN (*International Bank Account Number*) to forma NRB poprzedzona prefiksem `PL`. Ma 28 znaków: 2-literowy kod kraju `PL`, po którym następuje 26-cyfrowy NRB.

## Użycie

```ts
import { Numerik } from '@slashlab/numerik-js'

// Szybkie sprawdzenie
Numerik.iban().isValid('PL61102010260000000000000000')   // true

// Format z odstępami jest akceptowany
Numerik.iban().isValid('PL61 1020 1026 0000 0000 0000 0000')   // true

// Pełny obiekt z danymi
const result = Numerik.iban().validate('PL61102010260000000000000000')
result.isValid   // true

// Parsowanie do obiektu z danymi
const iban = Numerik.iban().parse('PL61102010260000000000000000')

// Null zamiast wyjątku w przypadku błędu
const maybe = Numerik.iban().tryParse('bad-input') // null
```

## Metody zwracanego obiektu

`parse()` i `tryParse()` zwracają instancję `Iban`.

### Podstawowe

| Metoda | Typ zwracany | Opis |
|--------|-------------|------|
| `getRaw()` | `string` | Oryginalne dane wejściowe, bez zmian. |
| `getNormalized()` | `string` | `PL` + 26 cyfr (spacje usunięte). |
| `toString()` | `string` | Alias dla `getNormalized()`. |

### Formatowanie

| Metoda | Typ zwracany | Opis |
|--------|-------------|------|
| `getFormatted()` | `string` | Czytelny IBAN: `PLCC NNNN NNNN NNNN NNNN NNNN NNNN`. |

### Struktura

| Metoda | Typ zwracany | Opis |
|--------|-------------|------|
| `getCountryCode()` | `string` | Zawsze `'PL'`. |
| `getNrb()` | `string` | 26-cyfrowa część NRB (bez prefiksu `PL`). |
| `getCheckDigits()` | `string` | Znaki 2–3 (2 cyfry po kodzie kraju) — cyfry kontrolne MOD-97. |
| `getSortCode()` | `string` | Cyfry 4–11 IBAN (8 cyfr) — kod sortowania banku. |
| `getBankCode()` | `string` | Cyfry 4–6 IBAN (3 cyfry) — identyfikator banku. |
| `getAccountNumber()` | `string` | Cyfry 12–27 IBAN (16 cyfr) — numer rachunku klienta. |

## Przykłady

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

## Powody błędów

| Powód | Wartość | Warunek |
|-------|---------|-------|
| `InvalidLength` | `invalid_length` | Dane wejściowe nie mają dokładnie 28 znaków (2 + 26 cyfr) po normalizacji. |
| `InvalidCharacters` | `invalid_characters` | Obecne są znaki inne niż `PL`, cyfry i spacje. |
| `InvalidFormat` | `invalid_format` | Brakujący lub nieprawidłowy prefiks kraju `PL`. |
| `InvalidChecksum` | `invalid_checksum` | Suma kontrolna MOD-97 nie zgadza się. |

## Algorytm walidacji

Używa algorytmu **MOD-97** z normy ISO 13616:

1. Odrzuć dane wejściowe dłuższe niż 40 znaków. Usuń spacje i myślniki. Sprawdź obecność prefiksu `PL`.
2. Sprawdź, czy pozostało dokładnie 28 znaków (`PL` + 26 cyfr).
3. Przestaw: przesuń pierwsze 4 znaki (`PL` + 2 cyfry kontrolne) na koniec i zastąp kod kraju jego odpowiednikiem numerycznym (`PL` = `2521`), tworząc 30-cyfrowy ciąg.
4. Oblicz 30-cyfrowy ciąg modulo 97. Wynik musi wynosić `1`.

Pełna dokumentacja algorytmu MOD-97 NRB w sekcji [Algorytmy](/pl/guide/algorithms/#nrb).

## Powiązane

- [NRB](/pl/identifiers/nrb/) — krajowa (bez prefiksu) forma tego numeru rachunku.

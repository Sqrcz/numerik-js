---
title: NRB
description: Waliduj i parsuj polskie numery NRB z @slashlab/numerik-js.
---

NRB (*Numer Rachunku Bankowego*) to 26-cyfrowy krajowy numer rachunku bankowego w Polsce, weryfikowany przy użyciu sumy kontrolnej MOD-97 ze standardu IBAN. NRB jest strukturalnie częścią numeryczną polskiego IBAN (tj. IBAN bez prefiksu `PL`).

## Użycie

```ts
import { Numerik } from '@slashlab/numerik-js'

// Szybkie sprawdzenie
Numerik.nrb().isValid('61102010260000000000000000')   // true

// Format z odstępami jest akceptowany
Numerik.nrb().isValid('61 1020 1026 0000 0000 0000 0000')   // true

// Format z prefiksem IBAN jest też akceptowany
Numerik.nrb().isValid('PL61102010260000000000000000')   // true

// Pełny obiekt z danymi
const result = Numerik.nrb().validate('61102010260000000000000000')
result.isValid   // true

// Parsowanie do obiektu z danymi
const nrb = Numerik.nrb().parse('61102010260000000000000000')

// Null zamiast wyjątku w przypadku błędu
const maybe = Numerik.nrb().tryParse('bad-input') // null
```

## Metody zwracanego obiektu

`parse()` i `tryParse()` zwracają instancję `Nrb`.

### Podstawowe

| Metoda | Typ zwracany | Opis |
|--------|-------------|------|
| `getRaw()` | `string` | Oryginalne dane wejściowe, bez zmian. |
| `getNormalized()` | `string` | 26 cyfr, bez prefiksu i spacji. |
| `toString()` | `string` | Alias dla `getNormalized()`. |

### Formatowanie

| Metoda | Typ zwracany | Opis |
|--------|-------------|------|
| `getFormatted()` | `string` | Czytelna postać: `CC NNNN NNNN NNNN NNNN NNNN NNNN`. |
| `getIban()` | `string` | Pełny polski IBAN: `PL` + 26 cyfr. |
| `getFormattedIban()` | `string` | Czytelny IBAN: `PLCC NNNN NNNN NNNN NNNN NNNN NNNN`. |

### Struktura

| Metoda | Typ zwracany | Opis |
|--------|-------------|------|
| `getCheckDigits()` | `string` | Pierwsze 2 cyfry — cyfry kontrolne MOD-97. |
| `getSortCode()` | `string` | Cyfry 2–9 (8 cyfr) — kod sortowania banku. |
| `getBankCode()` | `string` | Cyfry 2–4 (3 cyfry) — identyfikator banku. |
| `getAccountNumber()` | `string` | Cyfry 10–25 (16 cyfr) — numer rachunku klienta. |

## Przykłady

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

## Powody błędów

| Powód | Wartość | Warunek |
|-------|---------|-------|
| `InvalidLength` | `invalid_length` | Dane wejściowe nie mają dokładnie 26 cyfr po normalizacji. |
| `InvalidCharacters` | `invalid_characters` | Obecne są znaki inne niż cyfry, spacje i opcjonalny prefiks `PL`. |
| `InvalidChecksum` | `invalid_checksum` | Suma kontrolna MOD-97 nie zgadza się. |

## Algorytm walidacji

Używa algorytmu **MOD-97** z normy ISO 13616 (standard IBAN):

1. Odrzuć dane wejściowe dłuższe niż 32 znaki. Usuń spacje i opcjonalny prefiks `PL`.
2. Sprawdź, czy pozostało dokładnie 26 cyfr.
3. Przestaw: przesuń pierwsze 4 cyfry na koniec i poprzedź numerycznym kodem kraju dla Polski (`2521`), tworząc 32-cyfrowy ciąg.
4. Oblicz 32-cyfrowy ciąg modulo 97. Wynik musi wynosić `1`.

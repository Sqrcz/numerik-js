---
title: Paszport
description: Waliduj i parsuj numery polskich paszportów z @slashlab/numerik-js.
---

Numer polskiego paszportu to 9-znakowy alfanumeryczny identyfikator składający się z 2-literowej serii, 6-cyfrowego numeru sekwencyjnego i cyfry kontrolnej weryfikowanej przy użyciu ważonej sumy kontrolnej ICAO 9303 — tego samego algorytmu używanego w dokumentach podróży na całym świecie.

## Użycie

```ts
import { Numerik } from '@slashlab/numerik-js'

// Szybkie sprawdzenie
Numerik.passport().isValid('AB1234564')   // true

// Pełny obiekt z danymi
const result = Numerik.passport().validate('AB1234564')
result.isValid   // true

// Parsowanie do obiektu z danymi
const passport = Numerik.passport().parse('AB1234564')

// Null zamiast wyjątku w przypadku błędu
const maybe = Numerik.passport().tryParse('bad-input') // null
```

Dane wejściowe są normalizowane do wielkich liter; spacje i myślniki są usuwane:

```ts
Numerik.passport().isValid('ab 123456 4')   // true
Numerik.passport().isValid('ab-123456-4')   // true
```

## Metody zwracanego obiektu

`parse()` i `tryParse()` zwracają instancję `Passport`.

### Podstawowe

| Metoda | Typ zwracany | Opis |
|--------|-------------|------|
| `getRaw()` | `string` | Oryginalne dane wejściowe, bez zmian. |
| `getNormalized()` | `string` | Wielkie litery, spacje i myślniki usunięte. |
| `toString()` | `string` | Alias dla `getNormalized()`. |

### Struktura

| Metoda | Typ zwracany | Opis |
|--------|-------------|------|
| `getSeries()` | `string` | Pierwsze 2 znaki (seria literowa), np. `AB`. |
| `getSequentialNumber()` | `string` | Znaki 2–7 (6 cyfr), np. `123456`. |
| `getCheckDigit()` | `string` | Znak 8 (cyfra kontrolna), np. `4`. |

## Przykłady

```ts
const passport = Numerik.passport().parse('AB1234564')

passport.getRaw()                // 'AB1234564'
passport.getNormalized()         // 'AB1234564'
passport.getSeries()             // 'AB'
passport.getSequentialNumber()   // '123456'
passport.getCheckDigit()         // '4'

// Dane wejściowe małymi literami
const passport2 = Numerik.passport().parse('ab1234564')
passport2.getRaw()               // 'ab1234564'
passport2.getNormalized()        // 'AB1234564'
```

## Powody błędów

| Powód | Wartość | Warunek |
|-------|---------|-------|
| `InvalidLength` | `invalid_length` | Dane wejściowe nie mają dokładnie 9 znaków po normalizacji. |
| `InvalidCharacters` | `invalid_characters` | Pozycje 0–1 zawierają znaki inne niż litery, lub pozycje 2–8 zawierają znaki inne niż cyfry. |
| `InvalidChecksum` | `invalid_checksum` | Cyfra kontrolna ICAO 9303 nie zgadza się. |

## Algorytm walidacji

Używa ważonej sumy kontrolnej **ICAO 9303**. Wagi `[7, 3, 1]` powtarzają się cyklicznie dla pierwszych 8 znaków. Cyfry odwzorowują swoją wartość nominalną (0–9); litery odwzorowują `A=10` do `Z=35`. Cyfra kontrolna równa się ważonej sumie modulo 10.

1. Odrzuć dane wejściowe dłuższe niż 32 znaki. Usuń spacje i myślniki, zamień na wielkie litery.
2. Sprawdź, czy pozostało dokładnie 9 znaków.
3. Sprawdź, czy pozycje 0–1 to litery alfabetu.
4. Sprawdź, czy pozycje 2–8 to cyfry.
5. Oblicz sumę kontrolną ICAO 9303 dla pozycji 0–7. Wynik musi być równy cyfrze na pozycji 8.

Pełna dokumentacja algorytmu ICAO 9303 w sekcji [Algorytmy](/pl/guide/algorithms/#icao-9303).

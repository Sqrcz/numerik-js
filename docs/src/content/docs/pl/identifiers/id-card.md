---
title: Dowód osobisty
description: Waliduj i parsuj numery polskich dowodów osobistych z @slashlab/numerik-js.
---

Numer polskiego dowodu osobistego (*dowód osobisty*) to 9-znakowy alfanumeryczny identyfikator składający się z 3-literowej serii, 5-cyfrowego numeru sekwencyjnego i cyfry kontrolnej weryfikowanej przy użyciu ważonej sumy kontrolnej ICAO 9303.

## Użycie

```ts
import { Numerik } from '@slashlab/numerik-js'

// Szybkie sprawdzenie
Numerik.idCard().isValid('ABC123454')   // true

// Pełny obiekt z danymi
const result = Numerik.idCard().validate('ABC123454')
result.isValid   // true

// Parsowanie do obiektu z danymi
const idCard = Numerik.idCard().parse('ABC123454')

// Null zamiast wyjątku w przypadku błędu
const maybe = Numerik.idCard().tryParse('bad-input') // null
```

Dane wejściowe są normalizowane do wielkich liter; spacje i myślniki są usuwane:

```ts
Numerik.idCard().isValid('abc 123 454')   // true
Numerik.idCard().isValid('abc-123-454')   // true
```

## Metody zwracanego obiektu

`parse()` i `tryParse()` zwracają instancję `IdCard`.

### Podstawowe

| Metoda | Typ zwracany | Opis |
|--------|-------------|------|
| `getRaw()` | `string` | Oryginalne dane wejściowe, bez zmian. |
| `getNormalized()` | `string` | Wielkie litery, spacje i myślniki usunięte. |
| `toString()` | `string` | Alias dla `getNormalized()`. |

### Struktura

| Metoda | Typ zwracany | Opis |
|--------|-------------|------|
| `getSeries()` | `string` | Pierwsze 3 znaki (seria literowa), np. `ABC`. |
| `getSequentialNumber()` | `string` | Znaki 3–7 (5 cyfr), np. `12345`. |
| `getCheckDigit()` | `string` | Znak 8 (cyfra kontrolna), np. `4`. |

## Przykłady

```ts
const idCard = Numerik.idCard().parse('ABC123454')

idCard.getRaw()                // 'ABC123454'
idCard.getNormalized()         // 'ABC123454'
idCard.getSeries()             // 'ABC'
idCard.getSequentialNumber()   // '12345'
idCard.getCheckDigit()         // '4'

// Małe litery + myślniki w danych wejściowych
const idCard2 = Numerik.idCard().parse('abc-123-454')
idCard2.getRaw()               // 'abc-123-454'
idCard2.getNormalized()        // 'ABC123454'
```

## Powody błędów

| Powód | Wartość | Warunek |
|-------|---------|-------|
| `InvalidLength` | `invalid_length` | Dane wejściowe nie mają dokładnie 9 znaków po normalizacji. |
| `InvalidCharacters` | `invalid_characters` | Pozycje 0–2 zawierają znaki inne niż litery, lub pozycje 3–8 zawierają znaki inne niż cyfry. |
| `InvalidFormat` | `invalid_format` | Litery serii zawierają `O` lub `Q` (wykluczone z alfabetu serii dowodów osobistych). |
| `InvalidChecksum` | `invalid_checksum` | Cyfra kontrolna ICAO 9303 nie zgadza się. |

## Algorytm walidacji

Używa ważonej sumy kontrolnej **ICAO 9303**. Wagi `[7, 3, 1]` powtarzają się cyklicznie dla pierwszych 8 znaków. Cyfry odwzorowują swoją wartość nominalną (0–9); litery odwzorowują `A=10` do `Z=35`. Cyfra kontrolna równa się ważonej sumie modulo 10.

1. Odrzuć dane wejściowe dłuższe niż 32 znaki. Usuń spacje i myślniki, zamień na wielkie litery.
2. Sprawdź, czy pozostało dokładnie 9 znaków.
3. Sprawdź, czy pozycje 0–2 to litery alfabetu.
4. Sprawdź, czy pozycje 0–2 nie zawierają `O` ani `Q`.
5. Sprawdź, czy pozycje 3–8 to cyfry.
6. Oblicz sumę kontrolną ICAO 9303 dla pozycji 0–7. Wynik musi być równy cyfrze na pozycji 8.

Pełna dokumentacja algorytmu ICAO 9303 w sekcji [Algorytmy](/pl/guide/algorithms/#icao-9303).

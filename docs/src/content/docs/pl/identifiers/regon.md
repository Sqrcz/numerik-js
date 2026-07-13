---
title: REGON
description: Waliduj i parsuj polskie numery REGON — zarówno 9-cyfrowe, jak i 14-cyfrowe — z @slashlab/numerik-js.
---

REGON (*Rejestr Gospodarki Narodowej*) to polski numer identyfikacyjny rejestru przedsiębiorców. Występuje w dwóch formach:

- **9 cyfr** — dla podmiotów indywidualnych (przedsiębiorcy jednoosobowi, osoby fizyczne).
- **14 cyfr** — dla osób prawnych z jednostkami lokalnymi (pierwsze 9 cyfr to bazowy REGON, ostatnie 5 identyfikuje jednostkę lokalną).

## Użycie

```ts
import { Numerik } from '@slashlab/numerik-js'

// Szybkie sprawdzenie
Numerik.regon().isValid('850518457')        // true (9-cyfrowy)
Numerik.regon().isValid('85051845749370')   // true (14-cyfrowy)

// Pełny obiekt z danymi
const result = Numerik.regon().validate('850518457')
result.isValid   // true

// Parsowanie do obiektu z danymi
const regon = Numerik.regon().parse('850518457')

// Null zamiast wyjątku w przypadku błędu
const maybe = Numerik.regon().tryParse('bad-input') // null
```

## Metody zwracanego obiektu

`parse()` i `tryParse()` zwracają instancję `Regon`.

### Podstawowe

| Metoda | Typ zwracany | Opis |
|--------|-------------|------|
| `getRaw()` | `string` | Oryginalne dane wejściowe, bez zmian. |
| `getNormalized()` | `string` | Cyfry bez białych znaków. |
| `toString()` | `string` | Alias dla `getNormalized()`. |

### Typ i struktura

| Metoda | Typ zwracany | Opis |
|--------|-------------|------|
| `getType()` | `RegonType` | `RegonType.Individual` (9-cyfrowy) lub `RegonType.LegalEntity` (14-cyfrowy). |
| `getBaseRegon()` | `string` | Pierwsze 9 cyfr — zawsze obecne dla obu typów. |
| `getLocalUnitSuffix()` | `string \| null` | Ostatnie 5 cyfr dla numerów 14-cyfrowych; `null` dla 9-cyfrowych. |
| `isLocalUnit()` | `boolean` | `true` dla 14-cyfrowych (osoba prawna z jednostką lokalną). |

## Przykłady

```ts
import { Numerik, RegonType } from '@slashlab/numerik-js'

// REGON 9-cyfrowy
const regon = Numerik.regon().parse('850518457')

regon.getType()              // RegonType.Individual
regon.getBaseRegon()         // '850518457'
regon.getLocalUnitSuffix()   // null
regon.isLocalUnit()          // false

// REGON 14-cyfrowy
const regon14 = Numerik.regon().parse('85051845749370')

regon14.getType()             // RegonType.LegalEntity
regon14.getBaseRegon()        // '850518457'
regon14.getLocalUnitSuffix()  // '49370'
regon14.isLocalUnit()         // true
```

## Powody błędów

| Powód | Wartość | Warunek |
|-------|---------|-------|
| `InvalidLength` | `invalid_length` | Dane wejściowe nie mają dokładnie 9 lub 14 cyfr po normalizacji. |
| `InvalidCharacters` | `invalid_characters` | Po usunięciu białych znaków pozostają znaki inne niż cyfry. |
| `InvalidChecksum` | `invalid_checksum` | Cyfra kontrolna nie zgadza się. Dla 14-cyfrowych może dotyczyć zarówno sprawdzenia bazowych 9 cyfr, jak i sprawdzenia pełnych 14 cyfr. |

## Algorytm walidacji

**Wagi dla 9 cyfr:** `8, 9, 2, 3, 4, 5, 6, 7`

**Wagi dla 14 cyfr:** `2, 4, 8, 5, 0, 9, 7, 3, 6, 1, 2, 4, 8`

**Walidacja 9-cyfrowa:**
1. Usuń białe znaki. Sprawdź, czy pozostało dokładnie 9 cyfr.
2. Pomnóż pierwsze 8 cyfr przez wagi dla 9-cyfrowych, zsumuj, oblicz `mod 11`. Jeśli wynik wynosi `10`, cyfra kontrolna musi wynosić `0`. W przeciwnym razie wynik musi być równy cyfrze 9.

**Walidacja 14-cyfrowa:**
1. Usuń białe znaki. Sprawdź, czy pozostało dokładnie 14 cyfr.
2. Zwaliduj pierwsze 9 cyfr jako samodzielny REGON 9-cyfrowy.
3. Pomnóż wszystkie 13 znaczących cyfr przez wagi dla 14-cyfrowych, zsumuj, oblicz `mod 11`. Jeśli wynik wynosi `10`, cyfra kontrolna musi wynosić `0`. W przeciwnym razie wynik musi być równy cyfrze 14.

Pełna dokumentacja w sekcji [Algorytmy](/pl/guide/algorithms/).

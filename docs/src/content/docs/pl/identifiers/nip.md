---
title: NIP
description: Waliduj i parsuj polskie numery NIP z @slashlab/numerik-js.
---

NIP (*Numer Identyfikacji Podatkowej*) to 10-cyfrowy numer identyfikacji podatkowej w Polsce, używany zarówno przez osoby fizyczne, jak i prawne.

## Użycie

```ts
import { Numerik } from '@slashlab/numerik-js'

// Szybkie sprawdzenie
Numerik.nip().isValid('5260250274')   // true

// Pełny obiekt z danymi
const result = Numerik.nip().validate('5260250274')
result.isValid   // true

// Parsowanie do obiektu z danymi
const nip = Numerik.nip().parse('5260250274')

// Null zamiast wyjątku w przypadku błędu
const maybe = Numerik.nip().tryParse('bad-input') // null
```

NIP akceptuje myślniki i spacje jako separatory w danych wejściowych:

```ts
Numerik.nip().isValid('526-025-02-74')   // true
Numerik.nip().isValid('526 025 02 74')   // true
```

## Metody zwracanego obiektu

`parse()` i `tryParse()` zwracają instancję `Nip`.

### Podstawowe

| Metoda | Typ zwracany | Opis |
|--------|-------------|------|
| `getRaw()` | `string` | Oryginalne dane wejściowe, bez zmian. |
| `getNormalized()` | `string` | Same cyfry po usunięciu myślników i spacji. |
| `toString()` | `string` | Alias dla `getNormalized()`. |

### Formatowanie i metadane

| Metoda | Typ zwracany | Opis |
|--------|-------------|------|
| `getFormatted()` | `string` | Kanoniczna postać wyświetlania `NNN-NNN-NN-NN`. |
| `getFormattedAlternative()` | `string` | Alternatywna postać `NNN-NN-NN-NNN` używana w niektórych dokumentach prawnych. |
| `getTaxOfficeCode()` | `string` | Pierwsze 3 cyfry — wskazuje wystawiający urząd skarbowy. |

## Przykłady

```ts
const nip = Numerik.nip().parse('5260250274')

nip.getRaw()                   // '5260250274'
nip.getNormalized()            // '5260250274'
nip.getFormatted()             // '526-025-02-74'
nip.getFormattedAlternative()  // '526-02-50-274'
nip.getTaxOfficeCode()         // '526'

// Z sformatowanymi danymi wejściowymi
const nip2 = Numerik.nip().parse('526-025-02-74')
nip2.getRaw()          // '526-025-02-74'
nip2.getNormalized()   // '5260250274'
```

## Powody błędów

| Powód | Wartość | Warunek |
|-------|---------|-------|
| `InvalidLength` | `invalid_length` | Dane wejściowe nie mają dokładnie 10 cyfr po usunięciu separatorów. |
| `InvalidCharacters` | `invalid_characters` | Obecne są znaki inne niż cyfry, myślniki i spacje. |
| `InvalidFormat` | `invalid_format` | Pierwsze 3 cyfry to `000` (żaden urząd skarbowy nie ma kodu 000). |
| `InvalidChecksum` | `invalid_checksum` | Cyfra kontrolna nie zgadza się. |
| `AllSameDigit` | `all_same_digit` | Wszystkie cyfry są identyczne — tylko tryb ścisły. |

## Algorytm walidacji

Wagi: `6, 5, 7, 2, 3, 4, 5, 6, 7`

1. Usuń myślniki i spacje. Sprawdź, czy pozostało dokładnie 10 cyfr.
2. Sprawdź, czy pierwsze 3 cyfry to nie `000`.
3. Pomnóż każdą z pierwszych 9 cyfr przez odpowiednią wagę, zsumuj, oblicz `mod 11`. Wynik musi być równy cyfrze 10; ponieważ jedna cyfra może przyjmować tylko wartości 0–9, wynik modulo równy `10` nigdy nie pasuje i zawsze kończy się błędem `InvalidChecksum`.

Pełna dokumentacja w sekcji [Algorytmy](/pl/guide/algorithms/).

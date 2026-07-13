---
title: PESEL
description: Waliduj i parsuj numery PESEL z @slashlab/numerik-js. Wyodrębnia datę urodzenia, płeć, wiek, stulecie i numer porządkowy.
---

PESEL (*Powszechny Elektroniczny System Ewidencji Ludności*) to powszechny 11-cyfrowy numer identyfikacyjny obywatela Polski. Koduje datę urodzenia, stulecie urodzenia, płeć i porządkowy numer seryjny posiadacza.

## Użycie

```ts
import { Numerik } from '@slashlab/numerik-js'

// Szybkie sprawdzenie
Numerik.pesel().isValid('92060512186')   // true

// Pełny obiekt z danymi
const result = Numerik.pesel().validate('92060512186')
result.isValid   // true

// Parsowanie do obiektu z danymi
const pesel = Numerik.pesel().parse('92060512186')

// Null zamiast wyjątku w przypadku błędu
const maybe = Numerik.pesel().tryParse('bad-input') // null
```

## Metody zwracanego obiektu

`parse()` i `tryParse()` zwracają instancję `Pesel`.

### Podstawowe

| Metoda | Typ zwracany | Opis |
|--------|-------------|------|
| `getRaw()` | `string` | Oryginalne dane wejściowe, bez zmian. |
| `getNormalized()` | `string` | Cyfry bez białych znaków. |
| `toString()` | `string` | Alias dla `getNormalized()`. |

### Zwracające dane

| Metoda | Typ zwracany | Opis |
|--------|-------------|------|
| `getBirthDate()` | `Date` | Data urodzenia zdekodowana z PESEL. Zwraca nowy obiekt `Date`, niepowiązany z oryginałem. |
| `getGender()` | `Gender` | `Gender.Male` lub `Gender.Female`. |
| `getOrdinalNumber()` | `number` | 4-cyfrowy porządkowy numer seryjny (cyfry 7–10). Ostatnia cyfra koduje też płeć: nieparzysta = mężczyzna, parzysta = kobieta. |
| `getCentury()` | `number` | Stulecie urodzenia jako rok bazowy, np. `1900`, `2000`, `2100`. |

### Sprawdzające

| Metoda | Typ zwracany | Opis |
|--------|-------------|------|
| `isMale()` | `boolean` | `true` gdy płeć to `Gender.Male`. |
| `isFemale()` | `boolean` | `true` gdy płeć to `Gender.Female`. |
| `getAge()` | `number` | Pełne lata od daty urodzenia do dziś. |
| `isAdult()` | `boolean` | `true` gdy `getAge() >= 18`. |

## Przykłady

```ts
import { Numerik, Gender } from '@slashlab/numerik-js'

const pesel = Numerik.pesel().parse('92060512186')

pesel.getRaw()           // '92060512186'
pesel.getNormalized()    // '92060512186'
pesel.getBirthDate()     // Date — 1992-06-05
pesel.getGender()        // Gender.Female
pesel.isFemale()         // true
pesel.getOrdinalNumber() // 1218 (cyfry 7–10)
pesel.getCentury()       // 1900
pesel.getAge()           // obliczane na bieżąco
pesel.isAdult()          // true
```

## Kodowanie stulecia

Cyfry miesiąca w numerze PESEL kodują zarówno rzeczywisty miesiąc, jak i stulecie urodzenia:

| Zakres zapisanego miesiąca | Rzeczywisty miesiąc | Stulecie urodzenia |
|---------------------------|---------------------|-------------------|
| 01–12 | 01–12 | 1900–1999 |
| 21–32 | 01–12 | 2000–2099 |
| 41–52 | 01–12 | 2100–2199 |
| 61–72 | 01–12 | 2200–2299 |
| 81–92 | 01–12 | 1800–1899 |

## Powody błędów

| Powód | Wartość | Warunek |
|-------|---------|-------|
| `InvalidLength` | `invalid_length` | Dane wejściowe nie mają dokładnie 11 cyfr po normalizacji. |
| `InvalidCharacters` | `invalid_characters` | Po usunięciu białych znaków pozostają znaki inne niż cyfry. |
| `InvalidMonth` | `invalid_month` | Kodowanie miesiąca nie pasuje do żadnego ze znanych zakresów stulecia. |
| `InvalidDate` | `invalid_date` | Zdekodowana data nie jest prawdziwą datą kalendarzową. |
| `FutureDate` | `future_date` | Zdekodowana data urodzenia jest w przyszłości (tylko tryb ścisły). |
| `InvalidChecksum` | `invalid_checksum` | Cyfra kontrolna nie zgadza się z obliczoną wartością. |
| `AllSameDigit` | `all_same_digit` | Wszystkie 11 cyfr jest identycznych (tylko tryb ścisły). |

## Algorytm walidacji

Wagi: `1, 3, 7, 9, 1, 3, 7, 9, 1, 3`

1. Odrzuć dane wejściowe dłuższe niż 32 znaki. Usuń białe znaki. Sprawdź, czy pozostało dokładnie 11 cyfr.
2. Zdekoduj datę urodzenia używając tabeli kodowania stulecia powyżej. Sprawdź, czy data jest prawdziwą datą kalendarzową. W trybie ścisłym odrzuć też daty urodzenia w przyszłości.
3. Oblicz sumę kontrolną: pomnóż każdą z pierwszych 10 cyfr przez odpowiednią wagę, zsumuj iloczyny, oblicz `mod 10`, odejmij od `10`, oblicz `mod 10` ponownie. Wynik musi być równy cyfrze 11.
4. W trybie ścisłym odrzuć dane wejściowe, w których wszystkie 11 cyfr jest identycznych.

Pełna dokumentacja w sekcji [Algorytmy](/pl/guide/algorithms/).

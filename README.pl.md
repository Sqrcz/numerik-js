# numerik-js

[![License](https://img.shields.io/github/license/sqrcz/numerik-js.svg)](LICENSE)
[![Tests](https://github.com/sqrcz/numerik-js/actions/workflows/tests.yml/badge.svg)](https://github.com/sqrcz/numerik-js/actions/workflows/tests.yml)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@slashlab/numerik-js)](https://bundlephobia.com/package/@slashlab/numerik-js)
[![npm](https://img.shields.io/npm/v/@slashlab/numerik-js.svg)](https://www.npmjs.com/package/@slashlab/numerik-js)
[![npm downloads](https://img.shields.io/npm/dm/@slashlab/numerik-js.svg)](https://www.npmjs.com/package/@slashlab/numerik-js)

[English](README.md) | **Polski**

> Walidacja i parsowanie polskich numerów identyfikacyjnych — PESEL, NIP, REGON, KRS, NRB, VAT-EU, IBAN, dowód osobisty oraz paszport. Zwraca czytelne obiekty danych, precyzyjnie wskazuje powody błędów i nie posiada zewnętrznych zależności produkcyjnych. Biblioteka stworzona z myślą o TypeScript (TypeScript-first).

Port JavaScript/TypeScript biblioteki [slashlab/numerik](https://github.com/sqrcz/numerik) (PHP).

## Instalacja

```bash
npm install @slashlab/numerik-js
# lub
pnpm add @slashlab/numerik-js
```

## Szybki start

```ts
import { Numerik } from '@slashlab/numerik-js'

// Proste sprawdzenie poprawności (zwraca boolean)
Numerik.pesel().isValid('92060512186')  // true
Numerik.nip().isValid('5260250274')     // true

// Szczegółowy wynik walidacji z precyzyjnym powodem błędu
const result = Numerik.pesel().validate('92060512185')  // błędna cyfra kontrolna
result.isFailed()                         // true
result.getFirstFailure().reason           // ValidationFailureReason.InvalidChecksum

// Parsowanie do czytelnego obiektu danych
const pesel = Numerik.pesel().parse('92060512186')
pesel.getBirthDate()    // obiekt Date: 1992-06-05
pesel.getGender()       // Gender.Female
pesel.isAdult()         // true

// Bezpieczne parsowanie (tryParse) — zwraca null w przypadku błędu zamiast rzucać wyjątek
const parsed = Numerik.nip().tryParse('5260250274')
parsed?.getFormatted()  // '526-025-02-74'
```

## Tryb ścisły (strict)

Wszystkie identyfikatory przyjmują opcjonalny parametr `strict` (domyślnie `true`). Nie wpływa on na sposób normalizacji danych wejściowych — usuwanie spacji oraz myślników (tam, gdzie format na to pozwala) działa identycznie w obu trybach. Parametr `strict` uruchamia dodatkowe, semantyczne sprawdzenie wiarygodności numeru: odrzuca ciągi składające się z samych identycznych cyfr (PESEL, NIP, KRS, VAT-EU) oraz daty urodzenia z przyszłości (PESEL). Dowód osobisty, paszport, REGON, NRB oraz IBAN nie posiadają dodatkowych reguł w trybie ścisłym.

```ts
Numerik.nip(false).isValid('1111111111')  // true (poprawna suma kontrolna)
Numerik.nip(true).isValid('1111111111')   // false — ciąg identycznych cyfr
```

## Integracja z Zod

```ts
import { peselSchema, nipParseSchema } from '@slashlab/numerik-js/zod'
import { z } from 'zod'

const schema = z.object({
  pesel: peselSchema(),           // waliduje i zwraca string
  nip: nipParseSchema(),          // waliduje i parsuje do obiektu danych Nip
})
```

## Obsługiwane identyfikatory

| Grupa      | Identyfikator  | Klasa                |
| ---------- | -------------- | -------------------- |
| Osobowe    | PESEL          | `PeselIdentifier`    |
| Osobowe    | Dowód osobisty | `IdCardIdentifier`   |
| Osobowe    | Paszport       | `PassportIdentifier` |
| Podatkowe  | NIP            | `NipIdentifier`      |
| Podatkowe  | VAT-EU         | `VatEuIdentifier`    |
| Rejestrowe | REGON          | `RegonIdentifier`    |
| Rejestrowe | KRS            | `KrsIdentifier`      |
| Bankowe    | NRB            | `NrbIdentifier`      |
| Bankowe    | IBAN           | `IbanIdentifier`     |

## Historia zmian

Zobacz plik [CHANGELOG.md](CHANGELOG.md).

## Współtworzenie

Zobacz plik [CONTRIBUTING.md](CONTRIBUTING.md).

## Bezpieczeństwo

Zobacz plik [SECURITY.md](SECURITY.md).

## Licencja

Licencja MIT — szczegóły w pliku [LICENSE](LICENSE).

---

Jeśli ta biblioteka zaoszczędziła Twój czas → [☕ postaw mi kawę](https://buymeacoffee.com/sqrcz)

---
**Słowa kluczowe:** typescript, javascript, walidacja pesel, sprawdzanie nip, walidacja regon, walidacja krs, walidacja polskich numerów identyfikacyjnych, biblioteka pesel typescript, nip javascript, dowód osobisty, paszport, vat-ue, vat-eu, nrb, iban

[🇬🇧 English](README.md) | [🇵🇱 Polski](README.pl.md)

# numerik-js

[![License](https://img.shields.io/github/license/sqrcz/numerik-js.svg)](LICENSE)
[![Tests](https://github.com/sqrcz/numerik-js/actions/workflows/tests.yml/badge.svg)](https://github.com/sqrcz/numerik-js/actions/workflows/tests.yml)
[![CodeRabbit](https://img.shields.io/coderabbit/prs/github/sqrcz/numerik-js)](https://coderabbit.ai)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@slashlab/numerik-js)](https://bundlephobia.com/package/@slashlab/numerik-js)
[![npm](https://img.shields.io/npm/v/@slashlab/numerik-js.svg)](https://www.npmjs.com/package/@slashlab/numerik-js)
[![npm downloads](https://img.shields.io/npm/dm/@slashlab/numerik-js.svg)](https://www.npmjs.com/package/@slashlab/numerik-js)

> Walidacja i parsowanie polskich numerów identyfikacyjnych — PESEL, NIP, REGON, KRS, NRB, VAT-UE, IBAN, dowód osobisty i paszport. Bogate obiekty wartości, szczegółowe przyczyny błędów, zero zależności produkcyjnych. TypeScript-first.

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

// Prosty wynik boolowski
Numerik.pesel().isValid('92060512186')  // true
Numerik.nip().isValid('5260250274')     // true

// Szczegółowy wynik walidacji wraz z przyczyną błędu
const result = Numerik.pesel().validate('92060512185')  // błędna cyfra kontrolna
result.isFailed()                         // true
result.getFirstFailure().reason           // ValidationFailureReason.InvalidChecksum

// Parsowanie do obiektu wartości
const pesel = Numerik.pesel().parse('92060512186')
pesel.getBirthDate()    // obiekt Date: 1992-06-05
pesel.getGender()       // Gender.Female
pesel.isAdult()         // true

// Parsowanie bez wyjątków — zwraca null zamiast rzucać wyjątek
const parsed = Numerik.nip().tryParse('5260250274')
parsed?.getFormatted()  // '526-025-02-74'
```

## Tryb strict

Wszystkie identyfikatory przyjmują opcjonalną flagę `strict` (domyślnie `true`), która nigdy nie wpływa na sposób normalizacji danych wejściowych — normalizacja (usuwanie spacji i myślników tam, gdzie format na to pozwala) jest taka sama w obu trybach. Flaga `strict` włącza dodatkowe sprawdzenia sensowności semantycznej: odrzucanie numerów złożonych z samych identycznych cyfr (PESEL, NIP, KRS, VAT-UE) oraz dat urodzenia w przyszłości (PESEL). Dowód osobisty, paszport, REGON, NRB i IBAN nie mają dodatkowych sprawdzeń w trybie strict.

```ts
Numerik.nip(false).isValid('1111111111')  // true
Numerik.nip(true).isValid('1111111111')   // false — same cyfry
```

## Integracja z Zod

```ts
import { peselSchema, nipParseSchema } from '@slashlab/numerik-js/zod'
import { z } from 'zod'

const schema = z.object({
  pesel: peselSchema(),           // waliduje, zachowuje string
  nip: nipParseSchema(),          // waliduje i przekształca w obiekt wartości Nip
})
```

## Obsługiwane identyfikatory

| Grupa      | Identyfikator   | Klasa                 |
| ---------- | --------------- | --------------------- |
| Osobowe    | PESEL           | `PeselIdentifier`     |
| Osobowe    | Dowód osobisty  | `IdCardIdentifier`    |
| Osobowe    | Paszport        | `PassportIdentifier`  |
| Podatkowe  | NIP             | `NipIdentifier`       |
| Podatkowe  | VAT-UE          | `VatEuIdentifier`     |
| Biznesowe  | REGON           | `RegonIdentifier`     |
| Biznesowe  | KRS             | `KrsIdentifier`       |
| Bankowe    | NRB             | `NrbIdentifier`       |
| Bankowe    | IBAN            | `IbanIdentifier`      |

## Historia zmian

Zobacz [CHANGELOG.md](CHANGELOG.md).

## Współpraca

Zobacz [CONTRIBUTING.md](CONTRIBUTING.md).

## Bezpieczeństwo

Zobacz [SECURITY.md](SECURITY.md).

## Licencja

MIT — zobacz [LICENSE](LICENSE).

---

Jeśli ta biblioteka zaoszczędziła Ci czasu → [☕ postaw mi kawę](https://buymeacoffee.com/sqrcz)

---
**Słowa kluczowe:** typescript, javascript, walidacja pesel, sprawdzanie nip, walidacja regon, walidacja krs, walidacja polskich numerów identyfikacyjnych, biblioteka pesel typescript, nip javascript, dowód osobisty, paszport, vat-ue, nrb, iban

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-07-15

### Added

#### Personal

- PESEL (*Powszechny Elektroniczny System Ewidencji Ludności*) validation and parsing — `Numerik.pesel().validate()`, `isValid()`, `parse()`, `tryParse()`
- `Pesel` value object with `getBirthDate()`, `getGender()`, `getOrdinalNumber()`, `getAge()`, `isAdult()`, `isMale()`, `isFemale()`, `getCentury()`
- ID Card (*Dowód osobisty*) validation and parsing — `Numerik.idCard().validate()`, `isValid()`, `parse()`, `tryParse()`
- `IdCard` value object with `getSeries()`, `getSequentialNumber()`, `getCheckDigit()`
- Passport (*Paszport*) validation and parsing — `Numerik.passport().validate()`, `isValid()`, `parse()`, `tryParse()`
- `Passport` value object with `getSeries()`, `getSequentialNumber()`, `getCheckDigit()`

#### Tax & Business

- NIP (*Numer Identyfikacji Podatkowej*) validation and parsing — `Numerik.nip().validate()`, `isValid()`, `parse()`, `tryParse()`
- `Nip` value object with `getFormatted()` (NNN-NNN-NN-NN), `getFormattedAlternative()` (NNN-NN-NN-NNN), `getTaxOfficeCode()`
- VAT-EU (*Numer VAT UE*) validation and parsing — `Numerik.vatEu().validate()`, `isValid()`, `parse()`, `tryParse()`
- `VatEu` value object with `getCountryCode()`, `getNip()`, `getFormatted()`
- REGON (*Rejestr Gospodarki Narodowej*) validation and parsing — `Numerik.regon().validate()`, `isValid()`, `parse()`, `tryParse()`
- `Regon` value object with `getType()`, `getBaseRegon()`, `getLocalUnitSuffix()`, `isLocalUnit()`
- KRS (*Krajowy Rejestr Sądowy*) validation and parsing — `Numerik.krs().validate()`, `isValid()`, `parse()`, `tryParse()`
- `Krs` value object with `getFormatted()` (10-digit zero-padded), `getNumericValue()`

#### Banking

- NRB (*Numer Rachunku Bankowego*) validation and parsing — `Numerik.nrb().validate()`, `isValid()`, `parse()`, `tryParse()`
- `Nrb` value object with `getFormatted()`, `getIban()`, `getFormattedIban()`, `getCheckDigits()`, `getSortCode()`, `getBankCode()`, `getAccountNumber()`
- IBAN (Polish `PL`-prefixed NRB) validation and parsing — `Numerik.iban().validate()`, `isValid()`, `parse()`, `tryParse()`
- `Iban` value object with `getFormatted()`, `getCountryCode()`, `getNrb()`, `getCheckDigits()`, `getSortCode()`, `getBankCode()`, `getAccountNumber()`

#### Infrastructure

- `Numerik` facade with factory methods for all 9 identifier types, each accepting an optional `strict` parameter (default `true`)
- `ValidatorInterface.isStrict()` — query strict mode on any identifier
- `ValidationResult` with `pass()`, `fail()`, `failWithReason()` static factories; `ValidationFailureReason` enum with 9 cases
- `ValidationResult.toException()` — builds the matching exception directly from a result, without going through `parse()`
- `InvalidChecksumException`, `InvalidDateException`, `InvalidFormatException` — `parse()` throws the specific subclass matching the failure reason instead of a generic `ValidationException` (which all three still extend)
- Zod integration at `@slashlab/numerik-js/zod` — `{identifier}Schema(strict?)` for validate-only and `{identifier}ParseSchema(strict?)` for parsing to typed value objects, for all 9 identifiers
- Dual ESM + CJS output with full TypeScript declaration files
- CI on Node 22 and 24; automated publish to npm on `v*` tags via OIDC Trusted Publishing (no token required)

# Contributing to numerik-js

## Development Setup

```bash
git clone https://github.com/sqrcz/numerik-js.git
cd numerik-js
pnpm install
```

## Running Checks

```bash
pnpm check        # typecheck + tests
pnpm test         # test suite only
pnpm test:watch   # tests in watch mode
pnpm test:cover   # tests with coverage
pnpm build        # compile to dist/
```

## Workflow

- All changes go through a pull request — no direct commits to `main`
- Keep PRs focused — one feature or fix per PR
- Use [Conventional Commits](https://www.conventionalcommits.org) for commit messages

## Branch Naming

| Type    | Pattern              | Example                     |
| ------- | -------------------- | --------------------------- |
| Feature | `feat/<short-name>`  | `feat/passport-identifier`  |
| Fix     | `fix/<short-name>`   | `fix/pesel-century-calc`    |
| Chore   | `chore/<short-name>` | `chore/update-dependencies` |

## Pull Request Process

1. Fork the repository and create your branch from `main`.
2. Add tests for any new behaviour — all tests must pass.
3. Run `pnpm check` before opening a PR.
4. Fill in the PR template completely.
5. PRs are merged with rebase — each commit lands on `main` individually, so keep your history clean and meaningful.

## Commit Messages

```bash
feat: add PassportIdentifier
fix: correct PESEL century calculation for 2000s
docs: update REGON algorithm description
test: add NIP fixtures for invalid tax office codes
chore: bump vitest to 4.x
refactor: extract checksum calculation to dedicated method
```

## Adding a New Identifier

Every new identifier requires all of the following — PRs missing any item will not be merged:

- [ ] `src/identifiers/NewIdentifierIdentifier.ts`
- [ ] `src/value-objects/NewIdentifier.ts`
- [ ] `tests/new-identifier.test.ts`
- [ ] Entry added to `src/Numerik.ts` and exported from `src/index.ts`
- [ ] Zod schemas added to `src/zod/index.ts`
- [ ] CHANGELOG.md updated

## Reporting Bugs

Use the [Bug Report](https://github.com/sqrcz/numerik-js/issues/new?template=bug_report.yml) template.

## Security

See [SECURITY.md](SECURITY.md).

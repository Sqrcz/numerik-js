#!/usr/bin/env node
// Verifies the published build artifacts are actually importable and
// executable by a real consumer — not just type-correct. Runs after
// `pnpm build`, against dist/, never against src/.

import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const validNip = '5260250274'

async function checkEsmEntry() {
  const { NipIdentifier } = await import('@slashlab/numerik-js')
  assert.equal(
    typeof NipIdentifier,
    'function',
    '@slashlab/numerik-js (import): NipIdentifier did not resolve',
  )
  const result = new NipIdentifier().validate(validNip)
  assert.equal(
    result.isValid,
    true,
    '@slashlab/numerik-js (import): NipIdentifier failed to validate a known-good NIP',
  )
}

function checkCjsEntry() {
  const { NipIdentifier } = require('@slashlab/numerik-js')
  assert.equal(
    typeof NipIdentifier,
    'function',
    '@slashlab/numerik-js (require): NipIdentifier did not resolve',
  )
  const result = new NipIdentifier().validate(validNip)
  assert.equal(
    result.isValid,
    true,
    '@slashlab/numerik-js (require): NipIdentifier failed to validate a known-good NIP',
  )
}

async function checkZodSubpathEsm() {
  const { nipSchema } = await import('@slashlab/numerik-js/zod')
  assert.equal(
    typeof nipSchema,
    'function',
    '@slashlab/numerik-js/zod (import): nipSchema did not resolve',
  )
  const result = nipSchema().safeParse(validNip)
  assert.equal(
    result.success,
    true,
    '@slashlab/numerik-js/zod (import): nipSchema failed to validate a known-good NIP',
  )
}

function checkZodSubpathCjs() {
  const { nipSchema } = require('@slashlab/numerik-js/zod')
  assert.equal(
    typeof nipSchema,
    'function',
    '@slashlab/numerik-js/zod (require): nipSchema did not resolve',
  )
  const result = nipSchema().safeParse(validNip)
  assert.equal(
    result.success,
    true,
    '@slashlab/numerik-js/zod (require): nipSchema failed to validate a known-good NIP',
  )
}

await checkEsmEntry()
checkCjsEntry()
await checkZodSubpathEsm()
checkZodSubpathCjs()

console.log(
  'smoke test passed: @slashlab/numerik-js and @slashlab/numerik-js/zod resolve and execute via both import and require',
)

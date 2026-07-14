#!/usr/bin/env node
// Verifies the published build artifacts are actually importable and
// executable by a real consumer — not just type-correct. Runs after
// `pnpm build`, against dist/, never against src/.

import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const validNip = '5260250274'

async function checkEsmEntry() {
  const { NipIdentifier } = await import('../dist/index.js')
  assert.equal(
    typeof NipIdentifier,
    'function',
    'dist/index.js: NipIdentifier did not resolve',
  )
  const result = new NipIdentifier().validate(validNip)
  assert.equal(
    result.isValid,
    true,
    'dist/index.js: NipIdentifier failed to validate a known-good NIP',
  )
}

function checkCjsEntry() {
  const { NipIdentifier } = require('../dist/index.cjs')
  assert.equal(
    typeof NipIdentifier,
    'function',
    'dist/index.cjs: NipIdentifier did not resolve',
  )
  const result = new NipIdentifier().validate(validNip)
  assert.equal(
    result.isValid,
    true,
    'dist/index.cjs: NipIdentifier failed to validate a known-good NIP',
  )
}

async function checkZodSubpath() {
  const { nipSchema } = await import('../dist/zod/index.js')
  assert.equal(
    typeof nipSchema,
    'function',
    'dist/zod/index.js: nipSchema did not resolve',
  )
  const result = nipSchema().safeParse(validNip)
  assert.equal(
    result.success,
    true,
    'dist/zod/index.js: nipSchema failed to validate a known-good NIP',
  )
}

await checkEsmEntry()
checkCjsEntry()
await checkZodSubpath()

console.log(
  'smoke test passed: dist/index.js, dist/index.cjs, dist/zod/index.js all resolve and execute',
)

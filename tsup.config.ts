import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/zod/index.ts'],
  format: ['esm', 'cjs'],
  dts: {
    compilerOptions: {
      ignoreDeprecations: '6.0',
    },
  },
  clean: true,
  sourcemap: true,
})

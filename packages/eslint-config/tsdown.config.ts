import { defineConfig } from 'tsdown'

export default defineConfig([
    {
        entry: './src/index.ts',
        outDir: 'dist',
    },
    {
        banner: '#!/usr/bin/env node',
        entry: './src/cli/index.ts',
        outDir: 'bin',
    },
])

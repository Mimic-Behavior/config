import type { ConfigObject, Plugin } from '@eslint/core'

import { kebabFilename } from './rules'

const namespace = '@mimic-behavior'

const plugin: { configs: { all: ConfigObject } } & Plugin = {
    configs: {
        all: {
            files: ['**/*.{cjs,cts,js,jsx,mjs,mts,ts,tsx}'],
            plugins: {
                [namespace]: {
                    meta: {
                        namespace,
                    },
                    rules: {
                        'kebab-filename': kebabFilename,
                    },
                },
            },
            rules: {
                [`${namespace}/kebab-filename`]: 'error',
            },
        },
    },
}

export { plugin }

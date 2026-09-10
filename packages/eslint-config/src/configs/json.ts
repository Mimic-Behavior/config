import { type ConfigWithExtendsArray } from '@eslint/config-helpers'

import { interopDefault } from '../utils'

// https://www.npmjs.com/package/eslint-plugin-jsonc
async function json(): Promise<ConfigWithExtendsArray> {
    const plugin = await interopDefault(import('eslint-plugin-jsonc'))

    return [
        ...plugin.configs['recommended-with-jsonc'],
        {
            rules: {
                // https://ota-meshi.github.io/eslint-plugin-jsonc/rules/array-bracket-newline.html
                'jsonc/array-bracket-newline': ['error', { multiline: true }],
                // https://ota-meshi.github.io/eslint-plugin-jsonc/rules/array-bracket-spacing.html
                'jsonc/array-bracket-spacing': ['error', 'never'],
                // https://ota-meshi.github.io/eslint-plugin-jsonc/rules/array-element-newline.html
                'jsonc/array-element-newline': ['error', { minItems: 2, multiline: true }],
                // https://ota-meshi.github.io/eslint-plugin-jsonc/rules/comma-dangle.html
                'jsonc/comma-dangle': ['error', 'never'],
                // https://ota-meshi.github.io/eslint-plugin-jsonc/rules/comma-style.html
                'jsonc/comma-style': ['error', 'last'],
                // https://ota-meshi.github.io/eslint-plugin-jsonc/rules/indent.html
                'jsonc/indent': ['error', 4],
                // https://ota-meshi.github.io/eslint-plugin-jsonc/rules/key-spacing.html
                'jsonc/key-spacing': ['error', { afterColon: true, beforeColon: false, mode: 'strict' }],
                // https://ota-meshi.github.io/eslint-plugin-jsonc/rules/object-curly-newline.html
                'jsonc/object-curly-newline': ['error', { consistent: true }],
                // https://ota-meshi.github.io/eslint-plugin-jsonc/rules/object-curly-spacing.html
                'jsonc/object-curly-spacing': ['error', 'always'],
                // https://ota-meshi.github.io/eslint-plugin-jsonc/rules/object-property-newline.html
                'jsonc/object-property-newline': 'error',
                // https://ota-meshi.github.io/eslint-plugin-jsonc/rules/sort-keys.html
                'jsonc/sort-keys': [
                    'error',
                    'asc',
                    {
                        allowLineSeparatedGroups: false,
                        caseSensitive: true,
                        minKeys: 2,
                        natural: false,
                    },
                ],
            },
        },
    ]
}

export { json }

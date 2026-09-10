import { type ConfigWithExtendsArray } from '@eslint/config-helpers'

import { interopDefault } from '../utils'

// https://www.npmjs.com/package/eslint-plugin-yml
async function yaml(): Promise<ConfigWithExtendsArray> {
    const plugin = await interopDefault(import('eslint-plugin-yml'))

    return [
        ...plugin.configs.standard,
        {
            rules: {
                // https://ota-meshi.github.io/eslint-plugin-yml/rules/indent.html
                'yml/indent': ['error', 4, { indicatorValueIndent: 2 }],
                // https://ota-meshi.github.io/eslint-plugin-yml/rules/sort-keys.html
                'yml/sort-keys': [
                    'error',
                    'asc',
                    {
                        allowLineSeparatedGroups: false,
                        caseSensitive: true,
                        minKeys: 2,
                        natural: false,
                    },
                ],
                // https://ota-meshi.github.io/eslint-plugin-yml/rules/sort-sequence-values.html
                'yml/sort-sequence-values': [
                    'error',
                    {
                        order: {
                            caseSensitive: true,
                            natural: false,
                            type: 'asc',
                        },
                        pathPattern: '.*',
                    },
                ],
            },
        },
        {
            files: ['.gitlab-ci.yml', '**/workflows/**/*.yaml', '**/workflows/**/*.yml'],
            rules: {
                // https://ota-meshi.github.io/eslint-plugin-yml/rules/sort-keys.html
                'yml/sort-keys': 'off',
                // https://ota-meshi.github.io/eslint-plugin-yml/rules/sort-sequence-values.html
                'yml/sort-sequence-values': 'off',
            },
        },
    ]
}

export { yaml }

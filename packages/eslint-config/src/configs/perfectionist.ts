import { type ConfigWithExtendsArray } from '@eslint/config-helpers'

import { interopDefault } from '../utils'

// https://www.npmjs.com/package/eslint-plugin-perfectionist
async function perfectionist(): Promise<ConfigWithExtendsArray> {
    const plugin = await interopDefault(import('eslint-plugin-perfectionist'))

    return [
        plugin.configs['recommended-alphabetical'],
        {
            rules: {
                // https://perfectionist.dev/rules/sort-jsx-props
                'perfectionist/sort-jsx-props': [
                    'error',
                    {
                        customGroups: [
                            {
                                elementNamePattern: '^on.+',
                                groupName: 'callbacks',
                            },
                        ],
                        groups: ['unknown', 'callbacks'],
                    },
                ],
                // https://perfectionist.dev/rules/sort-objects
                'perfectionist/sort-objects': [
                    'error',
                    /**
                     * Отключает сортировку правил валидации в `useRegle`
                     */
                    {
                        newlinesBetween: 0,
                        type: 'unsorted',
                        useConfigurationIf: {
                            matchesAstSelector:
                                'CallExpression[callee.name="useRegle"] > :nth-child(2) ObjectExpression',
                        },
                    },
                    {
                        newlinesBetween: 0,
                        type: 'alphabetical',
                    },
                ],
            },
        },
    ]
}

export { perfectionist }

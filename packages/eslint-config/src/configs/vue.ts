import { type ConfigWithExtendsArray } from '@eslint/config-helpers'
import { type CompatibleParser } from 'typescript-eslint'

import { interopDefault } from '../utils'

// https://www.npmjs.com/package/eslint-plugin-vue
async function vue({
    typescript,
}: { typescript?: { parser: CompatibleParser } } = {}): Promise<ConfigWithExtendsArray> {
    const plugin = await interopDefault(import('eslint-plugin-vue'))
    const result: ConfigWithExtendsArray = [
        ...plugin.configs['flat/recommended'],
        {
            rules: {
                'vue/attributes-order': [
                    'error',
                    {
                        alphabetical: true,
                        ignoreVBindObject: true,
                        order: [
                            'DEFINITION',
                            'LIST_RENDERING',
                            'CONDITIONALS',
                            'RENDER_MODIFIERS',
                            'UNIQUE',
                            'GLOBAL',
                            'SLOT',
                            'TWO_WAY_BINDING',
                            'OTHER_DIRECTIVES',
                            'ATTR_DYNAMIC',
                            'ATTR_STATIC',
                            'ATTR_SHORTHAND_BOOL',
                            'EVENTS',
                            'CONTENT',
                        ],
                        sortLineLength: false,
                    },
                ],
                'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
                'vue/custom-event-name-casing': ['error', 'camelCase'],
                'vue/define-emits-declaration': ['error', 'type-literal'],
                'vue/html-closing-bracket-newline': 'off',
                'vue/html-indent': 'off',
                'vue/html-self-closing': 'off',
                'vue/order-in-components': 'off',
                'vue/singleline-html-element-content-newline': 'off',
            },
        },
    ]

    if (typescript) {
        const pluginParser = await interopDefault(import('vue-eslint-parser'))

        result.push({
            files: ['**/*.vue'],
            languageOptions: {
                parser: pluginParser,
                parserOptions: {
                    parser: typescript.parser,
                },
            },
        })
    }

    return result
}

export { vue }

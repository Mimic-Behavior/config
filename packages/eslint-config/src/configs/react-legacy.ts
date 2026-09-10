import { type ConfigWithExtendsArray } from '@eslint/config-helpers'

import { interopDefault } from '../utils'

// https://www.npmjs.com/package/eslint-plugin-react
async function reactLegacy(): Promise<ConfigWithExtendsArray> {
    const [plugin, pluginHooks] = await Promise.all([
        interopDefault(import('eslint-plugin-react')),
        interopDefault(import('eslint-plugin-react-hooks')),
    ])

    return [
        plugin.configs.flat.recommended,
        plugin.configs.flat['jsx-runtime'],
        pluginHooks.configs.flat.recommended,
        {
            rules: {
                // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-sort-props.md
                'react/jsx-sort-props': 'off',
            },
        },
    ]
}

export { reactLegacy }

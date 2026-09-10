import { type ConfigWithExtendsArray } from '@eslint/config-helpers'

import { interopDefault } from '../utils'

// https://www.npmjs.com/package/eslint-plugin-oxlint
async function oxlint(): Promise<ConfigWithExtendsArray> {
    const plugin = await interopDefault(import('eslint-plugin-oxlint'))

    return [plugin.configs['flat/recommended']]
}

export { oxlint }

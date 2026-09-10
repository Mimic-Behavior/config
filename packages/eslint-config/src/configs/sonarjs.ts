import { type ConfigWithExtendsArray } from '@eslint/config-helpers'

// https://www.npmjs.com/package/eslint-plugin-sonarjs
async function sonarjs(): Promise<ConfigWithExtendsArray> {
    const plugin = await import('eslint-plugin-sonarjs')

    return [plugin.configs.recommended]
}

export { sonarjs }

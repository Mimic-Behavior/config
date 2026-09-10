import { type ConfigWithExtendsArray } from '@eslint/config-helpers'

import { interopDefault } from '../utils'

// https://www.npmjs.com/package/@next/eslint-plugin-next
async function next(): Promise<ConfigWithExtendsArray> {
    const plugin = await interopDefault(import('@next/eslint-plugin-next'))

    return [plugin.configs['core-web-vitals']]
}

export { next }

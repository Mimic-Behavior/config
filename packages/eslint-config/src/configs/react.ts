import { type ConfigWithExtendsArray } from '@eslint/config-helpers'

import { interopDefault } from '../utils'

// https://www.npmjs.com/package/@eslint-react/eslint-plugin
async function react({
    legacy,
    typescript,
}: {
    legacy?: boolean
    typescript?: boolean
} = {}): Promise<ConfigWithExtendsArray> {
    const plugin = await interopDefault(import('@eslint-react/eslint-plugin'))

    return [
        ...(legacy
            ? [
                  plugin.configs['disable-conflict-eslint-plugin-react'],
                  plugin.configs['disable-conflict-eslint-plugin-react-hooks'],
              ]
            : []),
        plugin.configs[typescript ? 'recommended-typescript' : 'recommended'],
    ]
}

export { react }

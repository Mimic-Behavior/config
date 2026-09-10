import { type ConfigWithExtendsArray, defineConfig, globalIgnores } from '@eslint/config-helpers'
import js from '@eslint/js'
import globals from 'globals'
import typescript from 'typescript-eslint'

import { json, next, oxlint, perfectionist, react, reactLegacy, sonarjs, vue, yaml } from './configs'
import { plugin } from './plugin'

type Options = {
    extends?: ConfigWithExtendsArray
    ignores?: string[]
    plugins?: {
        /**
         * Enable JSON plugin
         * @package https://www.npmjs.com/package/eslint-plugin-jsonc
         */
        json?: boolean
        /**
         * Enable Next.js plugin
         * @package https://www.npmjs.com/package/@next/eslint-plugin-next
         */
        next?: boolean
        /**
         * Enable Oxlint plugin
         * @package https://www.npmjs.com/package/eslint-plugin-oxlint
         */
        oxlint?: boolean
        /**
         * Enable Perfectionist plugin
         * @package https://www.npmjs.com/package/eslint-plugin-perfectionist
         */
        perfectionist?: boolean
        /**
         * Enable React plugin
         * @package https://www.npmjs.com/package/@eslint-react/eslint-plugin
         */
        react?: boolean
        /**
         * Enable React plugin
         * @package https://www.npmjs.com/package/eslint-plugin-react
         */
        reactLegacy?: boolean
        /**
         * Enable SonarJS plugin
         * @package https://www.npmjs.com/package/eslint-plugin-sonarjs
         */
        sonarjs?: boolean
        /**
         * Enable TypeScript plugin
         * @package https://www.npmjs.com/package/typescript-eslint
         */
        typescript?: boolean
        /**
         * Enable Vue plugin
         * @package https://www.npmjs.com/package/eslint-plugin-vue
         */
        vue?: boolean
        /**
         * Enable YAML plugin
         * @package https://www.npmjs.com/package/eslint-plugin-yml
         */
        yaml?: boolean
    }
}

async function createConfig(options: Options = {}) {
    const baseConfig: ConfigWithExtendsArray = [
        {
            files: ['**/*.{cjs,cts,js,jsx,mjs,mts,ts,tsx,vue}'],
        },
        {
            extends: [js.configs.recommended, plugin.configs.all],
            languageOptions: {
                globals: {
                    ...globals.browser,
                    ...globals.node,
                },
                parserOptions: {
                    tsconfigRootDir: import.meta.dirname,
                },
            },
        },
        globalIgnores(
            [
                '**/.cache',
                '**/.next',
                '**/.nuxt',
                '**/.turbo',
                '**/*-lock.json',
                '**/*-lock.yaml',
                '**/dist',
                '**/node_modules',
                '**/package.json',
            ].concat(options.ignores ?? []),
        ),
    ]

    // https://www.npmjs.com/package/typescript-eslint
    if (options.plugins?.typescript) {
        baseConfig.push(typescript.configs.recommended)
    }

    // https://www.npmjs.com/package/eslint-plugin-react
    if (options.plugins?.reactLegacy) {
        const config = await reactLegacy()
        baseConfig.push(...config)
    }

    // https://www.npmjs.com/package/@eslint-react/eslint-plugin
    if (options.plugins?.react) {
        const config = await react({ legacy: options.plugins.react, typescript: options.plugins.typescript })
        baseConfig.push(...config)
    }

    // https://www.npmjs.com/package/@next/eslint-plugin-next
    if (options.plugins?.next) {
        const config = await next()
        baseConfig.push(...config)
    }

    // https://www.npmjs.com/package/eslint-plugin-vue
    if (options.plugins?.vue) {
        const config = await vue({ typescript: options.plugins.typescript ? { parser: typescript.parser } : undefined })
        baseConfig.push(...config)
    }

    // https://www.npmjs.com/package/eslint-plugin-sonarjs
    if (options.plugins?.sonarjs) {
        const config = await sonarjs()
        baseConfig.push(...config)
    }

    // https://www.npmjs.com/package/eslint-plugin-perfectionist
    if (options.plugins?.perfectionist) {
        const config = await perfectionist()
        baseConfig.push(...config)
    }

    // https://www.npmjs.com/package/eslint-plugin-jsonc
    if (options.plugins?.json) {
        const config = await json()
        baseConfig.push(...config)
    }

    // https://www.npmjs.com/package/eslint-plugin-yml
    if (options.plugins?.yaml) {
        const config = await yaml()
        baseConfig.push(...config)
    }

    // https://www.npmjs.com/package/eslint-plugin-oxlint
    if (options.plugins?.oxlint) {
        const config = await oxlint()
        baseConfig.push(...config)
    }

    return defineConfig(baseConfig, options?.extends ?? [])
}

export { createConfig }

import { cancel, confirm, intro, multiselect, note, outro, spinner } from '@clack/prompts'
import dedent from 'dedent'
import fs from 'fs/promises'
import util from 'node:util'
import { addDevDependency } from 'nypm'

import workspaceCatalog from '~/pnpm-workspace.catalog.json'

import { ensure } from './ensure'
import { exists } from './exists'

const CONFIG_FILENAME = 'eslint.config.ts'

async function create() {
    intro('Creating ESLint config...')

    const configFileExists = await exists(CONFIG_FILENAME)

    if (configFileExists && !(await ensure(confirm({ message: 'Config file already exists. Overwrite?' })))) {
        cancel('Operation cancelled')
        process.exit(0)
    }

    const plugins = await ensure(
        multiselect({
            message: 'Select plugins',
            options: [
                {
                    label: 'JSON',
                    value: {
                        dependencies: ['eslint-plugin-jsonc'],
                        name: 'json',
                    },
                },
                {
                    label: 'Next.js',
                    value: {
                        dependencies: ['@next/eslint-plugin-next'],
                        name: 'next',
                    },
                },
                {
                    label: 'Oxlint',
                    value: {
                        dependencies: ['eslint-plugin-oxlint', 'oxlint'],
                        name: 'oxlint',
                    },
                },
                {
                    label: 'Perfectionist',
                    value: {
                        dependencies: ['eslint-plugin-perfectionist'],
                        name: 'perfectionist',
                    },
                },
                {
                    label: 'React',
                    value: {
                        dependencies: ['@eslint-react/eslint-plugin'],
                        name: 'react',
                    },
                },
                {
                    label: 'React Legacy',
                    value: {
                        dependencies: ['eslint-plugin-react', 'eslint-plugin-react-hooks'],
                        name: 'reactLegacy',
                    },
                },
                {
                    label: 'SonarJS',
                    value: {
                        dependencies: ['eslint-plugin-sonarjs'],
                        name: 'sonarjs',
                    },
                },
                {
                    label: 'TypeScript',
                    value: {
                        dependencies: ['typescript-eslint'],
                        name: 'typescript',
                    },
                },
                {
                    label: 'Vue',
                    value: {
                        dependencies: ['eslint-plugin-vue', 'vue-eslint-parser'],
                        name: 'vue',
                    },
                },
                {
                    label: 'YAML',
                    value: {
                        dependencies: ['eslint-plugin-yml'],
                        name: 'yaml',
                    },
                },
            ] as const,
        }),
    )

    const configTemplate = dedent.withOptions({ alignValues: true })`
        import { createConfig } from '@mimic-behavior/eslint-config'

        export default createConfig({
            plugins: {
                ${plugins.map((plugin) => `${plugin.name}: true,`).join('\n')}
            },
        })

    `

    await fs.writeFile(CONFIG_FILENAME, configTemplate, { encoding: 'utf-8' })

    const dependencies = ['@mimic-behavior/eslint-config', 'jiti']
        .concat(plugins.flatMap((plugin) => plugin.dependencies))
        .sort()
        .map((name) => {
            if (isCatalogPackage(name)) {
                return `${name}@${workspaceCatalog[name]}`
            } else {
                return `${name}`
            }
        })

    note(
        dependencies
            .map((dependency) => {
                const atIndex = dependency.lastIndexOf('@')

                if (atIndex && atIndex !== -1) {
                    const packageName = dependency.slice(0, atIndex)
                    const packageVersion = dependency.slice(atIndex + 1)

                    return [util.styleText('green', '+'), packageName, util.styleText('gray', packageVersion)].join(' ')
                }

                return [util.styleText('green', '+'), dependency].join(' ')
            })
            .join('\n'),
        'Dependencies to install',
    )

    if (dependencies.length) {
        const s = spinner()

        s.start('Installing dependencies...')

        if (plugins.some((plugin) => plugin.name === 'reactLegacy')) {
            await addDevDependency('eslint@^9')
        } else {
            await addDevDependency(`eslint@${workspaceCatalog['eslint']}`)
        }

        await addDevDependency(dependencies)

        s.stop('Installation complete')
    }

    outro('ESLint config created')
}

function isCatalogPackage(name: string): name is keyof typeof workspaceCatalog {
    return name in workspaceCatalog
}

export { create }

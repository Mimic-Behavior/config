import { cancel, confirm, intro, log, multiselect, outro, spinner } from '@clack/prompts'
import dedent from 'dedent'
import { writeFile } from 'fs/promises'
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

    await writeFile(CONFIG_FILENAME, configTemplate, { encoding: 'utf-8' })

    const dependencies = [
        '@mimic-behavior/eslint-config',
        'eslint',
        'jiti',
        ...plugins.flatMap((plugin) => plugin.dependencies),
    ].map((name) => {
        if (name === 'eslint') {
            // Specify eslint version if legacy react plugin enabled
            if (plugins.some((plugin) => plugin.name === 'reactLegacy')) {
                return 'eslint@^9'
            } else {
                return 'eslint'
            }
        } else if (isCatalogPackage(name)) {
            return `${name}@${workspaceCatalog[name]}`
        } else {
            return name
        }
    })

    log.info(`Dependencies to installation: ${dependencies.join(', ')}`)

    if (dependencies.length) {
        const s = spinner()

        s.start('Installing dependencies...')

        await addDevDependency(dependencies)

        s.stop('Installation complete')
    }

    outro('ESLint config created')
}

function isCatalogPackage(name: string): name is keyof typeof workspaceCatalog {
    return name in workspaceCatalog
}

export { create }

import fs from 'node:fs'
import path from 'node:path'

export const hooks = {
    async afterAllResolved(lockfile) {
        if (process.env.CI) {
            return lockfile
        }

        try {
            const catalogYamlPath = path.join(import.meta.dirname, 'pnpm-workspace.yaml')
            const catalogJsonPath = path.join(import.meta.dirname, 'pnpm-workspace.catalog.json')

            if (fs.existsSync(catalogYamlPath)) {
                fs.writeFileSync(
                    catalogJsonPath,
                    JSON.stringify(parseCatalog(fs.readFileSync(catalogYamlPath, 'utf8')), null, 4),
                    'utf8',
                )
            }
        } catch (err) {
            console.error(err)
        }

        return lockfile
    },
}

/**
 * @param {string} yamlContent
 */
function parseCatalog(yamlContent) {
    const catalog = {}
    const contentLines = yamlContent.split('\n')

    let isCatalogSection = false

    for (const line of contentLines) {
        const trimmedLine = line.trim()

        if (trimmedLine.startsWith('#')) {
            continue
        }

        if (trimmedLine.startsWith('catalog:')) {
            isCatalogSection = true
            continue
        }

        if (isCatalogSection) {
            if (line.search(/\S/) === 0) {
                break
            }

            const colonIndex = trimmedLine.indexOf(':')

            if (colonIndex !== -1) {
                const regex = /['"]/g

                const key = trimmedLine.slice(0, colonIndex).trim().replace(regex, '')
                const val = trimmedLine
                    .slice(colonIndex + 1)
                    .trim()
                    .replace(regex, '')

                catalog[key] = val
            }
        }
    }

    return catalog
}

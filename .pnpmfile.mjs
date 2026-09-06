import fs from 'node:fs'
import path from 'node:path'
import yaml from 'yaml'

export const hooks = {
    afterAllResolved(lockfile) {
        try {
            const yamlPath = path.join(import.meta.dirname, 'pnpm-workspace.yaml')
            const jsonPath = path.join(import.meta.dirname, 'pnpm-workspace.json')

            if (fs.existsSync(yamlPath)) {
                fs.writeFileSync(
                    jsonPath,
                    JSON.stringify(yaml.parse(fs.readFileSync(yamlPath, 'utf8')), null, 4),
                    'utf8',
                )
            }
        } catch (err) {
            console.error(err)
        }

        return lockfile
    },
}

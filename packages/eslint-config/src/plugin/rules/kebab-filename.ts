import type { RuleDefinition } from '@eslint/core'

import path from 'path'

const kebabFilename: RuleDefinition = {
    create(context) {
        return {
            Program() {
                const filename = context.filename
                const basename = path.basename(filename, path.extname(filename))

                if (filename === '<input>' || filename === '<text>') {
                    return
                }

                if (/^_?[a-z0-9]+(?:-[a-z0-9]+)*$/.test(basename)) {
                    return
                }

                context.report({
                    loc: { column: 1, line: 1 },
                    message: `Filename "${basename}" should be in kebab-case`,
                })
            },
        }
    },
    meta: {
        languages: ['js/js', 'ts/ts'],
    },
}

export { kebabFilename }

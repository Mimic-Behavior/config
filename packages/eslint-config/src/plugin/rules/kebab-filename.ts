import type { RuleDefinition } from '@eslint/core'

import path from 'path'

const KEBAB_CASE_LEADING_UNDERSCORE_REGEXP = /^_?[a-z0-9]+(?:-[a-z0-9]+)*$/
const KEBAB_CASE_REGEXP = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const kebabFilename: RuleDefinition = {
    create(context) {
        return {
            Program() {
                const filename = context.filename
                const basename = path.basename(filename, path.extname(filename))

                if (filename === '<input>' || filename === '<text>') {
                    return
                }

                if (
                    basename
                        .split('.')
                        .every((part, index) =>
                            (index ? KEBAB_CASE_REGEXP : KEBAB_CASE_LEADING_UNDERSCORE_REGEXP).test(part),
                        )
                ) {
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

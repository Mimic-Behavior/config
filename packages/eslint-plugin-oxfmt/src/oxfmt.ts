import type { Plugin, RuleDefinition } from '@eslint/core'

import { rule } from './oxfmt-rule'

const plugin: Plugin = {
    rules: {
        oxfmt: rule as RuleDefinition,
    },
}

export { plugin }

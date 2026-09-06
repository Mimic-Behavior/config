import type { Config } from 'stylelint'

const config: Config = {
    extends: [
        import.meta.resolve('stylelint-config-recommended'),
        import.meta.resolve('stylelint-config-recommended-scss'),
        import.meta.resolve('stylelint-config-recess-order'),
    ],
    plugins: [import.meta.resolve('stylelint-order')],
}

export { config }

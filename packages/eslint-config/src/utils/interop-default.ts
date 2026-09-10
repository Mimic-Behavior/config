async function interopDefault<T>(promise: Promise<{ default: T }>): Promise<T> {
    const module = await promise
    return module.default
}

export { interopDefault }

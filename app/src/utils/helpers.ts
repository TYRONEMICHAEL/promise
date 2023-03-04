export const nothing = () => {
    // Does nothing
}

export const truncate = (value: any, max = 10) => {
    const stringValue = `${value}`
    return stringValue.substring(0, Math.min(stringValue.length, max))
}

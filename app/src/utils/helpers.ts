import { AnchorError } from '@project-serum/anchor'

export const nothing = (value) => {
  // Does nothing

  if (value instanceof AnchorError) {
    const error: AnchorError = value
    console.log(error)
    console.error(error.error.errorMessage)
  } else {
    console.log(value)
  }
}

export const truncate = (value: any, max = 10) => {
  const stringValue = `${value}`
  return stringValue.substring(0, Math.min(stringValue.length, max))
}

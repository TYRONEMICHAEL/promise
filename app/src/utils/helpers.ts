import { AnchorError } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'

export const nothing = (value) => {
  // Does nothing

  if (value instanceof AnchorError) {
    const error: AnchorError = value
    console.error(error.error.errorMessage)
  } else {
    console.log(value)
  }
}

export const truncate = (value: any, max = 10) => {
  const stringValue = `${value}`
  return stringValue.substring(0, Math.min(stringValue.length, max))
}

export const naiveToDid = (key: PublicKey) => `did:sol:${key.toBase58()}`

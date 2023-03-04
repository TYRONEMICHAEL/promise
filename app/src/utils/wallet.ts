import { WalletContextState } from '@solana/wallet-adapter-react'

export const getWalletPublicKey = (wallet: WalletContextState, truncate = 6) => {
  const formattedPublicKey = wallet.publicKey?.toString()
  return `${formattedPublicKey?.substring(0, Math.min(formattedPublicKey.length, truncate))}...`
}

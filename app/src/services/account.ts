import { WalletContextState } from '@solana/wallet-adapter-react'
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js'

export const getWalletBalance = async (connection: Connection, wallet: WalletContextState) => {
  const accountInfo = await connection.getAccountInfo(wallet.publicKey)
  if (!accountInfo) {
    return 0
  }

  return accountInfo.lamports / LAMPORTS_PER_SOL
}

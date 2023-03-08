import { WalletContextState } from '@solana/wallet-adapter-react'
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'

export const getWalletBalance = async (connection: Connection, wallet: WalletContextState) => {
  return await getBalanceForAccount(connection, wallet.publicKey)
}

export const getBalanceForAccount = async (connection: Connection, publicKey: PublicKey) => {
  const accountInfo = await connection.getAccountInfo(publicKey)
  if (!accountInfo) {
    return 0
  }

  return accountInfo.lamports / LAMPORTS_PER_SOL
}

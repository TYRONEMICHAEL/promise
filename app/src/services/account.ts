import { WalletContextState } from '@solana/wallet-adapter-react'
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'

export const getWalletBalance = async (connection: Connection, wallet: WalletContextState) => {
  return await getBalanceForAccount(connection, wallet.publicKey)
}

export const getBalanceForAccount = async (connection: Connection, publicKey: PublicKey): Promise<number> => {
  const accountInfo = await connection.getAccountInfo(publicKey)
  if (!accountInfo) {
    return 0
  }

  const amount = accountInfo.lamports / LAMPORTS_PER_SOL
  return (Math.round(amount * 100) / 100)
}

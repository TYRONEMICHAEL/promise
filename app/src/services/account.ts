import { WalletContextState } from '@solana/wallet-adapter-react'
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { solanaWalletCluster } from '../env'

let _connection: Connection = null

export const setConnection = (connection?: Connection) => {
  _connection = connection
}

export const getConnection = () => {
  if (_connection == null || _connection == undefined) throw new Error('Connection not set')

  return _connection
}

let _wallet: WalletContextState = null

export const setWallet = (wallet?: WalletContextState) => {
  _wallet = wallet
}

export const getWallet = () => {
  if (_wallet == null || _wallet == undefined) throw new Error('Wallet not set')

  return _wallet
}

export const getWalletBalance = async () => {
  const wallet = getWallet()
  return await getBalanceForAccount(wallet.publicKey)
}

export const getBalanceForAccount = async (publicKey: PublicKey): Promise<number> => {
  const connection = getConnection()
  const accountInfo = await connection.getAccountInfo(publicKey)
  if (!accountInfo) {
    return 0
  }

  const amount = accountInfo.lamports / LAMPORTS_PER_SOL
  return Math.round(amount * 100) / 100
}

export const canTopUp = () => {
  return solanaWalletCluster !== 'mainnet' && solanaWalletCluster !== 'mainnet-beta'
}

export const topUpAccount = async (publicKey: PublicKey, amountInSol: number): Promise<number> => {
  const connection = getConnection()
  const airdropSignature = await connection.requestAirdrop(
    publicKey,
    amountInSol * LAMPORTS_PER_SOL
  )

  const latestBlockHash = await connection.getLatestBlockhash()
  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: airdropSignature,
  })

  return getBalanceForAccount(publicKey)
}

import { AnchorError, AnchorProvider } from '@project-serum/anchor'
import { getConnection, getWallet } from '../services/account'
import { Transaction, TransactionInstruction } from '@solana/web3.js'

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

export const sendAndConfirmInstructions = async (instructions: TransactionInstruction[]) => {
  const connection = getConnection()
  const wallet = getWallet()
  const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions())
  const { blockhash } = await connection.getLatestBlockhash()
  const lastValidBlockHeight = await connection.getBlockHeight()
  const transaction = new Transaction({
    blockhash,
    lastValidBlockHeight,
  })
  transaction.add(...instructions)

  return await provider.sendAndConfirm(transaction)
}

export const confirmTransaction = async (signature: string) => {
  const connection = getConnection()
  const latestBlockHash = await connection.getLatestBlockhash()
  const result = await connection.confirmTransaction(
    {
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature,
    },
    'finalized'
  )

  if (result.value.err != null) {
    throw result.value.err
  }
}

export const sendAndConfirm = async (instructions: TransactionInstruction[]) => {
  const signature = await sendAndConfirmInstructions(instructions)
  await confirmTransaction(signature)
}

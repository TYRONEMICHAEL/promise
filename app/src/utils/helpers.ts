import { AnchorProvider } from '@project-serum/anchor'
import { Transaction, TransactionInstruction } from '@solana/web3.js'
import { SnackBarPushedMessage } from '../interfaces'
import { getConnection, getWallet } from '../services/account'
import { pushMessage } from '../stores/snackBarSlice'

export const nothing = () => {
  // Does nothing
}

export const catchAll = (dispatch, message?) => (error) => {
  console.error(error)
  const errorMessage = message ? `${message}: ${error}` : `${error}`
  const snackbarMessage: SnackBarPushedMessage = {
    text: errorMessage,
    lifetime: 3000,
    color: 'danger',
  }

  dispatch(pushMessage(snackbarMessage))
}

export const truncate = (value: any, max = 8) => {
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

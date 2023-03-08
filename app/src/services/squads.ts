import { WalletContextState } from '@solana/wallet-adapter-react'
import { Connection, Keypair, PublicKey, TransactionInstruction } from '@solana/web3.js'
import { getMsPDA } from '@sqds/sdk'
import { squadsInstance, squadsProgram } from '../env'
import {
  Squad,
  SquadExecutionStatus,
  SquadStatus,
  SquadTransaction,
  maxNumberOfMembersPerSquad,
  toSquadExecutionStatus,
} from '../interfaces/squads'

export const getSquads: (
  connection: Connection,
  wallet: WalletContextState
) => Promise<Squad[]> = async (connection: Connection, wallet: WalletContextState) => {
  const arrayOfMembers = Array.from(Array(maxNumberOfMembersPerSquad).keys())
  const program = squadsProgram(connection, wallet)
  const walletAddress = wallet.publicKey.toBase58()
  const squadsPromises = arrayOfMembers.reduce((result, current) => {
    return result.concat(
      program.account.ms.all([
        {
          memcmp: {
            offset:
              8 + // Anchor discriminator
              2 + // threshold value
              2 + // authority index
              4 + // transaction index
              4 + // processed internal transaction index
              1 + // PDA bump
              32 + // creator
              1 + // allow external execute
              4 + // for vec length
              32 * current, // position of key
            bytes: walletAddress,
          },
        },
      ])
    )
  }, [])

  const squads = (await Promise.all(squadsPromises)).flat()
  return await Promise.all(
    squads.map((squad) => {
      return getSquad(connection, wallet, squad)
    })
  )
}

const getSquad: (
  connection: Connection,
  wallet: WalletContextState,
  squad: any
) => Promise<Squad> = async (connection: Connection, wallet: WalletContextState, squad: any) => {
  const address = squad.publicKey.toBase58()
  const members = squad.account.keys.map((key) => key.toBase58())
  const transactions = await getTransactionsForSquad(
    connection,
    wallet,
    address,
    SquadExecutionStatus.waiting
  )
  let status = SquadStatus.active
  if (transactions.length > 0) {
    const user = wallet.publicKey.toBase58()
    const approved = transactions.filter(
      (transaction) => !transaction.approved.map((approver) => approver.toBase58()).includes(user)
    )
    if (approved.length > 0) {
      status = SquadStatus.requiresApproval
    } else {
      status = SquadStatus.waitingApproval
    }
  }

  return {
    address,
    members,
    createKey: squad.account.createKey.toBase58(),
    numberOfApprovers: squad.account.threshold,
    status,
    waitingTransactions: transactions,
  }
}

export const getSquadForOwner: (
  connection: Connection,
  wallet: WalletContextState,
  owner: PublicKey
) => Promise<Squad> = async (
  connection: Connection,
  wallet: WalletContextState,
  owner: PublicKey
) => {
  const squads = await getSquads(connection, wallet)
  return squads.find((squad) => {
    const authority = getAuthorityKeyForSquad(wallet, squad.address)
    return authority.toBase58() == owner.toBase58()
  })
}

export const getAuthorityKeyForSquad: (
  wallet: WalletContextState,
  squadAddress: string
) => PublicKey = (wallet: WalletContextState, squadAddress: string) => {
  const squads = squadsInstance(wallet)
  return squads.getAuthorityPDA(new PublicKey(squadAddress), 1)
}

export const createSquad: (
  wallet: WalletContextState,
  partner: string,
  threshold: number
) => Promise<Squad> = async (wallet: WalletContextState, partner: string, threshold: number) => {
  const squads = squadsInstance(wallet)
  const createKey = Keypair.generate()
  const partnerPublicKey = new PublicKey(partner)
  const multiSig = await squads.createMultisig(threshold, createKey.publicKey, [
    wallet.publicKey,
    partnerPublicKey,
  ])

  return {
    address: multiSig.publicKey.toBase58(),
    createKey: multiSig.createKey.toBase58(),
    members: multiSig.keys.map((key) => key.toBase58()),
    numberOfApprovers: multiSig.threshold,
    status: SquadStatus.active,
    waitingTransactions: [],
  }
}

export const isSquadWaitingApproval: (
  connection: Connection,
  wallet: WalletContextState,
  squadAddress: string
) => Promise<boolean> = async (
  connection: Connection,
  wallet: WalletContextState,
  squadAddress: string
) => {
  if (!wallet) {
    return false
  }

  const transactions = await getTransactionsForSquad(
    connection,
    wallet,
    squadAddress,
    SquadExecutionStatus.waiting
  )
  return transactions.length > 0
}

const getTransactionsForSquad: (
  connection: Connection,
  wallet: WalletContextState,
  squadAddress: string,
  status: SquadExecutionStatus
) => Promise<SquadTransaction[]> = async (
  connection: Connection,
  wallet: WalletContextState,
  squadAddress: string,
  status: SquadExecutionStatus
) => {
  const program = squadsProgram(connection, wallet)
  const transactions = await program.account.msTransaction.all([
    {
      memcmp: {
        offset:
          8 + // Anchor discriminator
          32, // Creator
        bytes: squadAddress,
      },
    },
  ])

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionStatus = toSquadExecutionStatus(transaction.account.status)
    return transactionStatus == status
  })

  const result = filteredTransactions.map((transaction) => {
    return {
      publicKey: transaction.publicKey,
      status: transaction.account.status,
      approved: transaction.account.approved,
    }
  })

  return result
}

export const approveTransactionForSquad: (
  wallet: WalletContextState,
  transaction: SquadTransaction
) => Promise<SquadExecutionStatus> = async (
  wallet: WalletContextState,
  transaction: SquadTransaction
) => {
  const squads = squadsInstance(wallet)
  await squads.approveTransaction(transaction.publicKey)

  transaction = await squads.getTransaction(transaction.publicKey)
  const status = toSquadExecutionStatus(transaction.status)
  if (status == SquadExecutionStatus.ready) {
    await squads.executeTransaction(transaction.publicKey)
    transaction = await squads.getTransaction(transaction.publicKey)
    return toSquadExecutionStatus(transaction.status)
  }

  return status
}

export const executeInstructionForSquad: (
  wallet: WalletContextState,
  squad: Squad,
  instruction: TransactionInstruction
) => Promise<SquadExecutionStatus> = async (
  wallet: WalletContextState,
  squad: Squad,
  instruction: TransactionInstruction
) => {
  const squads = squadsInstance(wallet)
  const [msPDA] = getMsPDA(new PublicKey(squad.createKey), squads.multisigProgramId)

  let transaction = await squads.createTransaction(msPDA, 1)
  await squads.addInstruction(transaction.publicKey, instruction)
  await squads.activateTransaction(transaction.publicKey)
  if (squad.members.includes(wallet.publicKey.toBase58())) {
    await squads.approveTransaction(transaction.publicKey)
  }

  transaction = await squads.getTransaction(transaction.publicKey)
  const status = toSquadExecutionStatus(transaction.status)
  if (status == SquadExecutionStatus.ready) {
    await squads.executeTransaction(transaction.publicKey)
    transaction = await squads.getTransaction(transaction.publicKey)
    return toSquadExecutionStatus(transaction.status)
  }

  return status
}

export const getInstructionForSquad: (
  connection: Connection,
  wallet: WalletContextState,
  squad: Squad
) => Promise<any> = async (connection: Connection, wallet: WalletContextState, squad: Squad) => {
  const program = squadsProgram(connection, wallet)
  const key = getAuthorityKeyForSquad(wallet, squad.address)
  const instructions = await program.account.msInstruction.all([
    {
      memcmp: {
        offset:
          8 + // Anchor discriminator
          32 + // program_id
          8 +
          32 * 2, // keys
        bytes: key.toBase58(),
      },
    },
  ])

  return instructions
}

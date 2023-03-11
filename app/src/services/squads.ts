import { Keypair, PublicKey, TransactionInstruction } from '@solana/web3.js'
import { getMsPDA } from '@sqds/sdk'
import { squadsInstance, squadsProgram } from '../env'
import {
  Squad,
  SquadExecutionStatus,
  SquadInstruction,
  SquadStatus,
  SquadTransaction,
  maxNumberOfMembersPerSquad,
  toSquadExecutionStatus,
} from '../interfaces/squads'
import { getConnection, getWallet } from './account'

export const getSquads: () => Promise<Squad[]> = async () => {
  const wallet = getWallet()
  if (!wallet.publicKey) return []
  const program = getSquadsProgram()
  const arrayOfMembers = Array.from(Array(maxNumberOfMembersPerSquad).keys())
  const walletAddress = wallet.publicKey.toBase58()
  const squadsPromises = arrayOfMembers.reduce((result, current) => {
    return result.concat(program.account.ms.all(getSquadMemberMemcmp(current, walletAddress)))
  }, [])

  const squads = (await Promise.all(squadsPromises)).flat()
  return await Promise.all(
    squads.map((squad) => {
      return getSquad(squad)
    })
  )
}

const getSquad: (squad: any) => Promise<Squad> = async (squad: any) => {
  const wallet = getWallet()
  const address = squad.publicKey.toBase58()
  const members = squad.account.keys.map((key) => key.toBase58())
  const transactions = await getTransactionsForSquad(address, SquadExecutionStatus.waiting)
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

export const getSquadForOwner: (owner: PublicKey) => Promise<Squad> = async (owner: PublicKey) => {
  const squads = await getSquads()
  return squads.find((squad) => {
    const authority = getAuthorityKeyForSquad(squad.address)
    return authority.toBase58() == owner.toBase58()
  })
}

export const getAuthorityKeyForSquad: (squadAddress: string) => PublicKey = (
  squadAddress: string
) => {
  const squads = getSquadsSDK()
  return squads.getAuthorityPDA(new PublicKey(squadAddress), 1)
}

export const createSquad: (partner: string, threshold: number) => Promise<Squad> = async (
  partner: string,
  threshold: number
) => {
  const wallet = getWallet()
  const squads = getSquadsSDK()
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

export const isSquadWaitingApproval: (squadAddress: string) => Promise<boolean> = async (
  squadAddress: string
) => {
  const transactions = await getTransactionsForSquad(squadAddress, SquadExecutionStatus.waiting)
  return transactions.length > 0
}

const getTransactionsForSquad: (
  squadAddress: string,
  status: SquadExecutionStatus
) => Promise<SquadTransaction[]> = async (squadAddress: string, status: SquadExecutionStatus) => {
  const program = getSquadsProgram()
  const transactions = await program.account.msTransaction.all(
    getSquadTransactionMemcmp(squadAddress)
  )

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionStatus = toSquadExecutionStatus(transaction.account.status)
    return transactionStatus == status
  })

  return filteredTransactions.map((transaction) => {
    return {
      publicKey: transaction.publicKey,
      status: transaction.account.status,
      approved: transaction.account.approved,
    }
  })
}

export const approveTransactionForSquad: (
  transaction: SquadTransaction
) => Promise<SquadExecutionStatus> = async (transaction: SquadTransaction) => {
  const squads = getSquadsSDK()
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
  squad: Squad,
  instruction: TransactionInstruction
) => Promise<SquadExecutionStatus> = async (squad: Squad, instruction: TransactionInstruction) => {
  const wallet = getWallet()
  const squads = getSquadsSDK()
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

export const getInstructionsForMatch: (
  matchAddress: string
) => Promise<SquadInstruction[]> = async (matchAddress: string) => {
  const program = getSquadsProgram()
  const instructions = await program.account.msInstruction.all(
    getSquadMatchInstructionMemcmp(matchAddress)
  )

  return instructions.map((instruction) => {
    return {
      address: instruction.publicKey.toBase58(),
      transaction: instruction.account.keys[0].pubkey.toBase58(),
      executed: instruction.account.executed,
    }
  })
}

export const getInstructionForSquad: (squad: Squad) => Promise<any> = async (squad: Squad) => {
  const program = getSquadsProgram()
  const key = getAuthorityKeyForSquad(squad.address)
  const instructions = await program.account.msInstruction.all(
    getSquadInstructionMemcmp(key.toBase58())
  )

  return instructions
}

export const getSquadForTransaction: (transactionAddress: string) => Promise<Squad> = async (
  transactionAddress: string
) => {
  const program = getSquadsProgram()
  const transaction = await program.account.msTransaction.fetch(new PublicKey(transactionAddress))
  const squad = await program.account.ms.fetch(transaction.ms)

  return await getSquad(squad)
}

const getSquadsSDK = () => {
  const wallet = getWallet()

  return squadsInstance(wallet)
}

const getSquadsProgram = () => {
  const connection = getConnection()
  const wallet = getWallet()

  return squadsProgram(connection, wallet)
}

const getSquadMemberMemcmp = (index: number, value: string) => {
  return [
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
          32 * index, // position of key
        bytes: value,
      },
    },
  ]
}

const getSquadTransactionMemcmp = (value: string) => {
  return [
    {
      memcmp: {
        offset:
          8 + // Anchor discriminator
          32, // Creator
        bytes: value,
      },
    },
  ]
}

const getSquadInstructionMemcmp = (value: string) => {
  return [
    {
      memcmp: {
        offset:
          8 + // Anchor discriminator
          32 + // program_id
          8 +
          32 * 2, // keys
        bytes: value,
      },
    },
  ]
}

const getSquadMatchInstructionMemcmp = (value: string) => {
  return [
    {
      memcmp: {
        offset: 78,
        bytes: value,
      },
    },
  ]
}

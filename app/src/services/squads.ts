import { AnchorProvider, Program } from '@project-serum/anchor'
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { Connection, Keypair, PublicKey, TransactionInstruction } from '@solana/web3.js'
import Squads, { getAuthorityPDA, getMsPDA } from '@sqds/sdk'
import { IDL, SquadsMpl } from '@sqds/sdk/lib/target/types/squads_mpl'

const maxNumberOfKeysPerSquad = 2

export type Squad = {
  name: string
  // description: string
  // icon: string
  address: string
  createKey: string
  members: string[]
  numberOfApprovers: number
}

export enum SquadExecutionStatus {
  draft,
  waiting,
  ready,
  executed,
  rejected,
  cancelled,
}

const toSquadExecutionStatus = (state) => {
  if (state['executeReady'] != null) {
    return SquadExecutionStatus.ready
  } else if (state['executed'] != null) {
    return SquadExecutionStatus.executed
  } else if (state['active']) {
    return SquadExecutionStatus.waiting
  } else if (state['draft']) {
    return SquadExecutionStatus.draft
  } else if (state['cancelled']) {
    return SquadExecutionStatus.cancelled
  } else {
    return SquadExecutionStatus.rejected
  }
}

const createSquadsInstance = (wallet: WalletContextState) => {
  return Squads.localnet(wallet, {
    multisigProgramId: new PublicKey('3RVSoJHxueZnjyzdre6gW6ciNZKTv7hnhLL39eary5kB'),
    programManagerProgramId: new PublicKey('7bEk3wSumpeE5gDNx4b5pqvfn28nRWn6XfFWzVGiaDEP'),
  })
}

const getSquadsProgram = (connection: Connection, wallet: WalletContextState) => {
  const idl = IDL
  return new Program<SquadsMpl>(
    idl,
    new PublicKey('3RVSoJHxueZnjyzdre6gW6ciNZKTv7hnhLL39eary5kB'),
    new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions())
  )
}

export const getSquadsForWallet: (
  connection: Connection,
  wallet: WalletContextState
) => Promise<Squad[]> = async (connection: Connection, wallet: WalletContextState) => {
  const squadsProgram = getSquadsProgram(connection, wallet)
  const squadsPromises: Promise<any[]>[] = Array.from(Array(maxNumberOfKeysPerSquad).keys()).reduce(
    (result, current) => {
      return result.concat(
        squadsProgram.account.ms.all([
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
              bytes: wallet.publicKey.toBase58(),
            },
          },
        ])
      )
    },
    []
  )

  const squads = (await Promise.all(squadsPromises)).flat()
  return squads.map((squad, index) => {
    return {
      name: `Squad ${index}`,
      address: squad.publicKey.toBase58(),
      createKey: squad.account.createKey.toBase58(),
      members: squad.account.keys.map((key) => key.toBase58()),
      numberOfApprovers: squad.account.threshold,
    }
  })
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
  const squads = await getSquadsForWallet(connection, wallet)
  return squads.find((squad) => {
    const authority = getAuthorityKeyForSquad(wallet, squad)
    return authority.toBase58() == owner.toBase58()
  })
}

export const createSquadForWallet: (
  wallet: WalletContextState,
  name: string,
  description: string,
  threshold: number,
  includeSelfAsMember: boolean,
  icon?: string,
  members?: string[]
) => Promise<Squad> = async (
  wallet: WalletContextState,
  name: string,
  description: string,
  threshold: number,
  includeSelfAsMember: boolean,
  icon?: string,
  members?: string[]
) => {
  const squads = createSquadsInstance(wallet)
  const createKey = Keypair.generate()
  const membersPubKeys =
    members?.filter((member) => member.length > 0).map((member) => new PublicKey(member)) ?? []
  const multiSig = await squads.createMultisig(
    threshold,
    createKey.publicKey,
    includeSelfAsMember ? membersPubKeys.concat(wallet.publicKey) : membersPubKeys,
    name,
    description,
    icon
  )

  return {
    name: 'New Squad',
    address: multiSig.publicKey.toBase58(),
    createKey: multiSig.createKey.toBase58(),
    members: multiSig.keys.map((key) => key.toBase58()),
    numberOfApprovers: multiSig.threshold,
  }
}

export const waitingForApprovalForSquad: (
  connection: Connection,
  wallet: WalletContextState,
  squad: Squad
) => Promise<boolean> = async (
  connection: Connection,
  wallet: WalletContextState,
  squad: Squad
) => {
  if (!squad.members.includes(wallet.publicKey.toBase58())) {
    return false
  }

  return await getWaitingTransactionForSquad(connection, wallet, squad) !== undefined
}

const getWaitingTransactionForSquad: (
  connection: Connection,
  wallet: WalletContextState,
  squad: Squad
) => Promise<any> = async (connection: Connection, wallet: WalletContextState, squad: Squad) => {
  const squadsProgram = getSquadsProgram(connection, wallet)
  const transactions = await squadsProgram.account.msTransaction.all([
    {
      memcmp: {
        offset: 8 + 32, // Anchor discriminator
        bytes: squad.address,
      },
    },
  ])

  return transactions.find((transaction) => {
    const status = toSquadExecutionStatus(transaction.account.status)
    const approved = transaction.account.approved.map((approver) => approver.toBase58())
    return status == SquadExecutionStatus.waiting && !approved.includes(wallet.publicKey.toBase58())
  })
}

export const approveTransactionForSquad: (
  connection: Connection,
  wallet: WalletContextState,
  squad: Squad
) => Promise<SquadExecutionStatus> = async (
  connection: Connection,
  wallet: WalletContextState,
  squad: Squad
) => {
  const squads = createSquadsInstance(wallet)
  let transaction = await getWaitingTransactionForSquad(connection, wallet, squad)
  await squads.approveTransaction(transaction.publicKey)

  transaction = await squads.getTransaction(transaction.publicKey)
  console.log('Transaction: ', transaction)
  const status = toSquadExecutionStatus(transaction.status)
  console.log('Current Status: ', status)
  if (status == SquadExecutionStatus.ready) {
    await squads.executeTransaction(transaction.publicKey)
    transaction = await squads.getTransaction(transaction.publicKey)
    return toSquadExecutionStatus(transaction.status)
  }

  return status
}

export const getAuthorityKeyForSquad: (wallet: WalletContextState, squad: Squad) => PublicKey = (
  wallet: WalletContextState,
  squad: Squad
) => {
  const squads = createSquadsInstance(wallet)
  return squads.getAuthorityPDA(new PublicKey(squad.address), 1)
}

export const executeInstruction: (
  wallet: WalletContextState,
  squad: Squad,
  instruction: TransactionInstruction
) => Promise<SquadExecutionStatus> = async (
  wallet: WalletContextState,
  squad: Squad,
  instruction: TransactionInstruction
) => {
  const squads = createSquadsInstance(wallet)
  const [msPDA] = getMsPDA(new PublicKey(squad.createKey), squads.multisigProgramId)

  console.log('MSPDA: ', msPDA)
  let transaction = await squads.createTransaction(msPDA, 1)
  console.log('Created Transaction: ', transaction)
  await squads.addInstruction(transaction.publicKey, instruction)
  console.log('Added Instruction')
  await squads.activateTransaction(transaction.publicKey)
  console.log('Activated Transaction')
  if (squad.members.includes(wallet.publicKey.toBase58())) {
    await squads.approveTransaction(transaction.publicKey)
    console.log('Approved Transaction')
  }

  transaction = await squads.getTransaction(transaction.publicKey)
  console.log('Transaction: ', transaction)
  const status = toSquadExecutionStatus(transaction.status)
  console.log('Current Status: ', status)
  if (status == SquadExecutionStatus.ready) {
    await squads.executeTransaction(transaction.publicKey)
    transaction = await squads.getTransaction(transaction.publicKey)
    return toSquadExecutionStatus(transaction.status)
  }

  return status
}

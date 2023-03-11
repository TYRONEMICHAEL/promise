import { PublicKey } from '@solana/web3.js'

export const maxNumberOfMembersPerSquad = 2

export type Squad = {
  address: string
  members: string[]
  createKey: string
  numberOfApprovers: number
  status: SquadStatus
  waitingTransactions: SquadTransaction[] 
}

export enum SquadStatus {
  active,
  waitingApproval,
  requiresApproval,
}

export const statusToString = (status) => {
  switch (status) {
    case SquadStatus.active:
      return 'Active'
    case SquadStatus.requiresApproval:
      return 'Requires approval'
    case SquadStatus.waitingApproval:
      return 'Waiting approval from member'
  }
}

export enum SquadExecutionStatus {
  draft,
  waiting,
  ready,
  executed,
  rejected,
  cancelled,
}

export type SquadTransaction = {
  publicKey: PublicKey
  status: any
  approved: PublicKey[]
}

export type SquadInstruction = {
    address: string
    transaction: string
    executed: boolean
}

export const toSquadExecutionStatus = (state) => {
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

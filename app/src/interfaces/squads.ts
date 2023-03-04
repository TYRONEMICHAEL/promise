import { PublicKey } from '@solana/web3.js'

export const maxNumberOfMembersPerSquad = 2

export type Squad = {
  address: string
  members: string[]
  createKey: string
  numberOfApprovers: number
  status: SquadStatus
}

export enum SquadStatus {
    active,
    waitingApproval,
    requiresApproval
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

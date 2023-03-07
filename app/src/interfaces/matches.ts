import { PromiseState } from 'promise-sdk/lib/sdk/src/promise/PromiseState'

export type Match = {
  id: number
  address: string
  state: PromiseState
  promiseeWager?: number
  endDate?: Date
  //   updatedAt: Date;
  //   createdAt: Date;
  numberOfPromisees: number
}

export const stateToString = (state: PromiseState) => {
  switch (state) {
    case PromiseState.active:
      return 'Active'
    case PromiseState.completed:
      return 'Completed'
    case PromiseState.created:
      return 'Created'
    case PromiseState.voided:
      return 'Cancelled'
  }
}

export type MatchDetails = {
  amountInLamports: number
  endDate?: Date
}

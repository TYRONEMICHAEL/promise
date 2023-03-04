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

export type MatchDetails = {
  amountInSol: number
  endDate?: Date
}

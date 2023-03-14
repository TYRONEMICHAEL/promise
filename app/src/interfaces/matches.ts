import { PublicKey } from '@solana/web3.js'
import { PromiseState } from 'promise-sdk/lib/sdk/src/promise/PromiseState'
import { PromiseeRuleset } from 'promise-sdk/lib/sdk/src/promisee/PromiseeRuleset'
import { RulesetDate } from 'promise-sdk/lib/sdk/src/rules/RulsetDate'
import { SolGate } from 'promise-sdk/lib/sdk/src/rules/SolGate'

export type Match = {
  id: number
  address: string
  state: PromiseState
  isOwner: boolean
  promiseeWager?: number
  endDate?: Date
  createdBy: string
  createdAt: Date
  updatedAt: Date
  numberOfPromisees: number
  uri?: string
}

export type MatchMetadataResult = {
  score: number[];
  squad: string;
}

export type MatchMetadata = {
  name?: string
  description?: string
  winner?: string
  score?: [MatchMetadataResult, MatchMetadataResult]
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

export class MatchDetails {
  amountInLamports: number
  endDate?: Date
  metadata?: MatchMetadata

  constructor(amountInLamports: number, endDate?: Date, metadata?: MatchMetadata) {
    this.amountInLamports = amountInLamports
    this.endDate = endDate
    this.metadata = metadata
  }

  toRuleset(): PromiseeRuleset {
    const endDateRuleset = this.endDate != null ? new RulesetDate(this.endDate.getTime()) : null
    const solWagerRuleset = new SolGate(this.amountInLamports)
    return new PromiseeRuleset(endDateRuleset, solWagerRuleset)
  }
}

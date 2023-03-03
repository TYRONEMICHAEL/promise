import { WalletContextState } from '@solana/wallet-adapter-react'
import { Connection, PublicKey } from '@solana/web3.js'
import { PromiseSDK } from 'promise-sdk/lib/sdk/src/PromiseSDK'
import { Network } from 'promise-sdk/lib/sdk/src/network/Network'
import { PromiseState } from 'promise-sdk/lib/sdk/src/promise/PromiseState'
import { PromiseeRuleset } from 'promise-sdk/lib/sdk/src/promisee/PromiseeRuleset'
import { Promisor } from 'promise-sdk/lib/sdk/src/promisor/Promisor'
import { PromisorRuleset } from 'promise-sdk/lib/sdk/src/promisor/PromisorRuleset'
import { RulesetDate } from 'promise-sdk/lib/sdk/src/rules/RulsetDate'
import { SolGate } from 'promise-sdk/lib/sdk/src/rules/SolGate'
import {
  Squad,
  SquadExecutionStatus,
  executeInstruction,
  getAuthorityKeyForSquad,
  getSquadForOwner,
  getSquadsForWallet,
} from './squads'

export type Match = {
  id: number
  address: string
  state: PromiseState

  promisorReward?: number
  endDate?: Date
  //   promiseeRuleset: PromiseeRuleset
  //   promisorRuleset: PromisorRuleset

  // updatedAt: Date;

  // createdAt: Date;

  numberOfPromisees: number
}

export type MatchDetails = {
  amountInSol: number
  endDate?: Date
}

export const getYourMatchesForWallet: (
  connection: Connection,
  wallet: WalletContextState
) => Promise<Match[]> = async (connection: Connection, wallet: WalletContextState) => {
  const promise = getPromiseSDK(connection, wallet)
  const network = await getNetwork(promise)
  const promisor = await getOrCreatePromisorForWallet(promise, wallet, network)
  const promises = await getPromisesForPromisor(promise, promisor)
  return promises.map((promise) => {
    return {
      id: promise.id,
      address: promise.address.toBase58(),
      state: promise.state,
      promisorReward:
        promise.promisorRuleset.solReward != null
          ? Number(promise.promisorRuleset.solReward.lamports)
          : null,
      endDate:
        promise.promiseeRuleset.endDate != null
          ? new Date(promise.promiseeRuleset.endDate.date)
          : null,
      numberOfPromisees: promise.numberOfPromisees,
    }
  })
}

export const getMatchesForWallet: (
  connection: Connection,
  wallet: WalletContextState
) => Promise<Match[]> = async (connection: Connection, wallet: WalletContextState) => {
  // TODO implement promisees in SDK
  return []
}

export const createMatchForWallet: (
  connection: Connection,
  wallet: WalletContextState,
  matchDetails: MatchDetails
) => Promise<Match> = async (
  connection: Connection,
  wallet: WalletContextState,
  matchDetails: MatchDetails
) => {
  const promise = getPromiseSDK(connection, wallet)
  const network = await getNetwork(promise)
  const promisor = await getOrCreatePromisorForWallet(promise, wallet, network)
  const promisorRuleset = new PromisorRuleset()
  const promiseeRuleset = new PromiseeRuleset(
    matchDetails.endDate != null && matchDetails.endDate > new Date()
      ? new RulesetDate(matchDetails.endDate.getTime())
      : null
  )
  const newPromise = await promise.createPromise(promisor, promisorRuleset, promiseeRuleset)
  const activatedPromise = await promise.activatePromise(newPromise)
  return {
    id: activatedPromise.id,
    address: activatedPromise.address.toBase58(),
    state: activatedPromise.state,
    promisorReward:
      activatedPromise.promisorRuleset.solReward != null
        ? Number(activatedPromise.promisorRuleset.solReward.lamports)
        : null,
    endDate:
      activatedPromise.promiseeRuleset.endDate != null
        ? new Date(activatedPromise.promiseeRuleset.endDate.date)
        : null,
    numberOfPromisees: activatedPromise.numberOfPromisees,
  }
}

export const acceptMatchForSquad: (
  connection: Connection,
  wallet: WalletContextState,
  match: Match,
  squad: Squad
) => Promise<SquadExecutionStatus> = async (
  connection: Connection,
  wallet: WalletContextState,
  match: Match,
  squad: Squad
) => {
  const promise = getPromiseSDK(connection, wallet)
  const pr = await promise.getPromise(new PublicKey(match.address))
  const owner = getAuthorityKeyForSquad(wallet, squad)
  const instruction = await promise.acceptPromiseInstruction(pr, owner)
  return await executeInstruction(wallet, squad, instruction)
}

export const getSquadsForMatch: (
  connection: Connection,
  wallet: WalletContextState,
  match: Match
) => Promise<Squad[]> = async (
  connection: Connection,
  wallet: WalletContextState,
  match: Match
) => {
  const promise = getPromiseSDK(connection, wallet)
  // TODO promisees for a promise
  const promisees = await promise.getPromisees()
  const filteredPromisees = await Promise.all(
    promisees
      .filter((promisee) => promisee.promise.toBase58() == match.address)
      .map((promisee) => getSquadForOwner(connection, wallet, promisee.owner))
  )

  return filteredPromisees.filter((x) => x !== undefined)
}

export const completeMatchForSquad: (
  connection: Connection,
  wallet: WalletContextState,
  match: Match,
  squad: Squad
) => Promise<boolean> = async (
  connection: Connection,
  wallet: WalletContextState,
  match: Match,
  squad: Squad
) => {
  const promise = getPromiseSDK(connection, wallet)
  const pr = await promise.getPromise(new PublicKey(match.address))
  // TODO get promisee for squad
  const owner = getAuthorityKeyForSquad(wallet, squad)
  const promisees = await promise.getPromisees()
  const promisee = promisees.find(promisee => promisee.owner.toBase58() == owner.toBase58())
  if (!promisee) {
    return false
  }
  
  await promise.completePromise(pr, promisee)
  return true
}

const getPromiseSDK = (connection: Connection, wallet: WalletContextState) => {
  return new PromiseSDK(connection, wallet)
}

const getNetwork = async (promise: PromiseSDK) => {
  const publicKey = new PublicKey('CVYRRk8HaNbvUbBNtok2ZjMFXuLXXHCftQrXVkA6cazS') // CHANGE THIS TO NETWORK
  //   const publicKey = new PublicKey(promiseNetworkAddress)
  return await promise.getNetwork(publicKey)
}

const getPromisorForOwner = async (promise: PromiseSDK, owner: PublicKey, network: Network) => {
  // TODO add filter to get promisor for owner
  const promisors = await promise.getPromisors()
  const promisor = promisors.find(
    (promisor) =>
      promisor.owner.toBase58() == owner.toBase58() &&
      promisor.network.toBase58() == network.address.toBase58()
  )
  return promisor
}

const createPromisor = async (promise: PromiseSDK, network: Network) => {
  return await promise.createPromisor(network)
}

const getOrCreatePromisorForWallet = async (
  promise: PromiseSDK,
  wallet: WalletContextState,
  network: Network
) => {
  const promisor = await getPromisorForOwner(promise, wallet.publicKey, network)
  if (promisor) {
    return promisor
  }

  return await createPromisor(promise, network)
}

const getPromisesForPromisor = async (promise: PromiseSDK, promisor: Promisor) => {
  // TODO add filter to get promises for promisor
  const promises = await promise.getPromises()
  return promises.filter((promise) => promise.promisor.toBase58() == promisor.address.toBase58())
}

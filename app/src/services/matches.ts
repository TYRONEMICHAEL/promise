import { WalletContextState } from '@solana/wallet-adapter-react'
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { PromiseSDK } from 'promise-sdk/lib/sdk/src/PromiseSDK'
import { Network } from 'promise-sdk/lib/sdk/src/network/Network'
import { PromiseField } from 'promise-sdk/lib/sdk/src/promise/PromiseFilter'
import { PromiseProtocol } from 'promise-sdk/lib/sdk/src/promise/PromiseProtocol'
import { PromiseeField } from 'promise-sdk/lib/sdk/src/promisee/PromiseeFilter'
import { PromiseeRuleset } from 'promise-sdk/lib/sdk/src/promisee/PromiseeRuleset'
import { PromisorField } from 'promise-sdk/lib/sdk/src/promisor/PromisorFilter'
import { PromisorRuleset } from 'promise-sdk/lib/sdk/src/promisor/PromisorRuleset'
import { RulesetDate } from 'promise-sdk/lib/sdk/src/rules/RulsetDate'
import { SolGate } from 'promise-sdk/lib/sdk/src/rules/SolGate'
import { promiseInstance, promiseNetworkPublicKey } from '../env'
import { Match, MatchDetails } from '../interfaces/matches'
import { Squad, SquadExecutionStatus, SquadTransaction } from '../interfaces/squads'
import { executeInstructionForSquad, getAuthorityKeyForSquad, getSquadForOwner } from './squads'

export const getMatches: (
  connection: Connection,
  wallet: WalletContextState,
  onlyYourMatches?: boolean
) => Promise<Match[]> = async (
  connection: Connection,
  wallet: WalletContextState,
  onlyYourMatches = false
) => {
  const promiseSDK = promiseInstance(connection, wallet)
  const network = await getNetwork(promiseSDK)
  let promises: PromiseProtocol[]
  if (onlyYourMatches) {
    const promisor = await getPromisor(promiseSDK, wallet, network)
    promises = await promiseSDK.getPromises({
      field: PromiseField.promisor,
      value: promisor.address.toBase58(),
    })
  } else {
    promises = await promiseSDK.getPromises({
      field: PromiseField.network,
      value: network.address.toBase58(),
    })
  }

  return promises.map((promise) => {
    return {
      id: promise.id,
      address: promise.address.toBase58(),
      state: promise.state,
      promiseeWager:
        promise.promiseeRuleset.solWager != null
          ? Number(promise.promiseeRuleset.solWager.lamports) / LAMPORTS_PER_SOL
          : null,
      endDate:
        promise.promiseeRuleset.endDate != null
          ? new Date(Number(promise.promiseeRuleset.endDate.date))
          : null,
      numberOfPromisees: promise.numberOfPromisees,
    }
  })
}

export const createMatch: (
  connection: Connection,
  wallet: WalletContextState,
  matchDetails: MatchDetails
) => Promise<Match> = async (
  connection: Connection,
  wallet: WalletContextState,
  matchDetails: MatchDetails
) => {
  const promiseSDK = promiseInstance(connection, wallet)
  const network = await getNetwork(promiseSDK)
  const promisor = await getPromisor(promiseSDK, wallet, network)
  const promisorRuleset = new PromisorRuleset()
  const promiseeRuleset = new PromiseeRuleset(
    matchDetails.endDate != null && matchDetails.endDate > new Date()
      ? new RulesetDate(matchDetails.endDate.getTime())
      : null,
    new SolGate(matchDetails.amountInLamports)
  )
  const promise = await promiseSDK.createPromise(promisor, promisorRuleset, promiseeRuleset)
  const activatedPromise = await promiseSDK.activatePromise(promise)
  return {
    id: activatedPromise.id,
    address: activatedPromise.address.toBase58(),
    state: activatedPromise.state,
    promiseeWager:
      activatedPromise.promiseeRuleset.solWager != null
        ? Number(activatedPromise.promiseeRuleset.solWager.lamports) / LAMPORTS_PER_SOL
        : null,
    endDate:
      activatedPromise.promiseeRuleset.endDate != null
        ? new Date(Number(activatedPromise.promiseeRuleset.endDate.date))
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
  const promiseSDK = promiseInstance(connection, wallet)
  const promise = await promiseSDK.getPromise(new PublicKey(match.address))
  const owner = getAuthorityKeyForSquad(wallet, squad.address)
  const instruction = await promiseSDK.buildAcceptPromise(promise, owner)
  return await executeInstructionForSquad(wallet, squad, instruction)
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
  const promiseSDK = promiseInstance(connection, wallet)
  const promisees = await promiseSDK.getPromisees({
    field: PromiseeField.promise,
    value: match.address,
  })
  const filteredPromisees = await Promise.all(
    promisees.map((promisee) => getSquadForOwner(connection, wallet, promisee.owner))
  )

  return filteredPromisees.filter((x) => x !== undefined)
}

export const getMatchForTransaction = async (wallet: WalletContextState, connection: Connection, transaction: SquadTransaction) => {
    const matches = await getMatches(connection, wallet)
    console.log(matches)
    return []
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
  const promiseSDK = promiseInstance(connection, wallet)
  const promise = await promiseSDK.getPromise(new PublicKey(match.address))
  const owner = getAuthorityKeyForSquad(wallet, squad.address)
  const promisees = await promiseSDK.getPromisees({
    field: PromiseeField.owner,
    value: owner.toBase58(),
  })
  if (!promisees || promisees.length <= 0) {
    return false
  }

  await promiseSDK.completePromise(promise, promisees[0])
  return true
}

const getNetwork = async (promiseSDK: PromiseSDK) => {
  return await promiseSDK.getNetwork(promiseNetworkPublicKey)
}

const getPromisorForOwner = async (promiseSDK: PromiseSDK, owner: PublicKey, network: Network) => {
  const promisors = await promiseSDK.getPromisors({
    field: PromisorField.owner,
    value: owner.toBase58(),
  })
  const promisor = promisors.find(
    (promisor) => promisor.network.toBase58() == network.address.toBase58()
  )
  return promisor
}

const getPromisor = async (
  promiseSDK: PromiseSDK,
  wallet: WalletContextState,
  network: Network
) => {
  const promisor = await getPromisorForOwner(promiseSDK, wallet.publicKey, network)
  if (promisor) {
    return promisor
  }

  return await createPromisor(promiseSDK, network)
}

const createPromisor = async (promise: PromiseSDK, network: Network) => {
  return await promise.createPromisor(network)
}

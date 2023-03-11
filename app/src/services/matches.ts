import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { PromiseField } from 'promise-sdk/lib/sdk/src/promise/PromiseFilter'
import { PromiseProtocol } from 'promise-sdk/lib/sdk/src/promise/PromiseProtocol'
import { PromiseeField } from 'promise-sdk/lib/sdk/src/promisee/PromiseeFilter'
import { Promisor } from 'promise-sdk/lib/sdk/src/promisor/Promisor'
import { PromisorField } from 'promise-sdk/lib/sdk/src/promisor/PromisorFilter'
import { PromisorRuleset } from 'promise-sdk/lib/sdk/src/promisor/PromisorRuleset'
import { promiseInstance, promiseNetworkAddress, promiseNetworkPublicKey } from '../env'
import { Match, MatchDetails } from '../interfaces/matches'
import { Squad, SquadExecutionStatus } from '../interfaces/squads'
import { getConnection, getWallet } from './account'
import {
  executeInstructionForSquad,
  getAuthorityKeyForSquad,
  getInstructionsForMatch,
  getSquadForOwner,
  getSquadForTransaction,
} from './squads'

export const getMatches: (onlyYourMatches?: boolean) => Promise<Match[]> = async (
  onlyYourMatches = false
) => {
  const promiseSDK = getPromiseSDK()
  const promisor = await getPromisor()
  let promises: PromiseProtocol[] = []
  if (onlyYourMatches) {
    if (promisor) {
      promises = await promiseSDK.getPromises({
        field: PromiseField.promisor,
        value: promisor.address.toBase58(),
      })
    }
  } else {
    const network = await getNetwork()
    promises = await promiseSDK.getPromises({
      field: PromiseField.network,
      value: network.address.toBase58(),
    })
  }

  return promises.map((promise) => matchFromPromise(promise, promisor))
}

export const createMatch: (matchDetails: MatchDetails) => Promise<Match> = async (
  matchDetails: MatchDetails
) => {
  const promiseSDK = getPromiseSDK()
  const promisor = await getPromisorOrCreate()
  const promisorRuleset = new PromisorRuleset()
  const promiseeRuleset = matchDetails.toRuleset()
  const promise = await promiseSDK.createPromise(promisor, promisorRuleset, promiseeRuleset)
  const activatedPromise = await promiseSDK.activatePromise(promise)
  return matchFromPromise(activatedPromise, promisor)
}

export const acceptMatch: (match: Match, squad: Squad) => Promise<SquadExecutionStatus> = async (
  match: Match,
  squad: Squad
) => {
  const promiseSDK = getPromiseSDK()
  const promise = await promiseSDK.getPromise(new PublicKey(match.address))
  const owner = getAuthorityKeyForSquad(squad.address)
  const instruction = await promiseSDK.buildAcceptPromise(promise, owner)
  return await executeInstructionForSquad(squad, instruction)
}

export const getParticipantsForMatch: (match: Match) => Promise<string[]> = async (
  match: Match
) => {
  const promiseSDK = getPromiseSDK()
  const promisees = await promiseSDK.getPromisees({
    field: PromiseeField.promise,
    value: match.address,
  })

  return promisees.map((promisee) => promisee.address.toBase58())
}

export const getSquadForParticipant: (address: string) => Promise<Squad> = async (
  address: string
) => {
  const promiseSDK = getPromiseSDK()
  const promisee = await promiseSDK.getPromisee(new PublicKey(address))
  if (!promisee) return

  return await getSquadForOwner(promisee.owner)
}

export const getSquadsForMatch: (match: Match) => Promise<Squad[]> = async (match: Match) => {
  const promiseSDK = getPromiseSDK()
  const promisees = await promiseSDK.getPromisees({
    field: PromiseeField.promise,
    value: match.address,
  })

  const filteredPromisees = await Promise.all(
    promisees.map((promisee) => getSquadForOwner(promisee.owner))
  )

  return filteredPromisees.filter((x) => x !== undefined)
}

export const completeMatch: (match: Match, squad: Squad) => Promise<boolean> = async (
  match: Match,
  squad: Squad
) => {
  const promiseSDK = getPromiseSDK()
  const promise = await promiseSDK.getPromise(new PublicKey(match.address))
  const owner = getAuthorityKeyForSquad(squad.address)
  const promisees = await promiseSDK.getPromisees({
    field: PromiseeField.owner,
    value: owner.toBase58(),
  })

  const promisee = promisees.find(
    (promisee) => promisee.promise.toBase58() == promise.address.toBase58()
  )
  if (!promisee) {
    return false
  }

  await promiseSDK.completePromise(promise, promisee)
  return true
}

const getPromiseSDK = () => {
  const connection = getConnection()
  const wallet = getWallet()

  return promiseInstance(connection, wallet)
}

const getNetwork = async () => {
  const promiseSDK = getPromiseSDK()
  return await promiseSDK.getNetwork(promiseNetworkPublicKey)
}

const getPromisor = async () => {
  const wallet = getWallet()
  const promiseSDK = getPromiseSDK()
  const promisors = await promiseSDK.getPromisors({
    field: PromisorField.owner,
    value: wallet.publicKey.toBase58(),
  })

  return promisors.find((promisor) => promisor.network.toBase58() == promiseNetworkAddress)
}

const getPromisorOrCreate = async () => {
  const promisor = await getPromisor()
  if (promisor) {
    return promisor
  }

  return await createPromisor()
}

const createPromisor = async () => {
  const promiseSDK = getPromiseSDK()
  const network = await getNetwork()
  return await promiseSDK.createPromisor(network)
}

const matchFromPromise = (promise: PromiseProtocol, promisor?: Promisor) => {
  const isOwner = promisor?.address?.toBase58() == promise.promisor.toBase58()
  const ruleset = promise.promiseeRuleset
  const promiseeWager = Number(ruleset.solWager?.lamports ?? 0) / LAMPORTS_PER_SOL
  const endDate = ruleset.endDate != null ? new Date(Number(ruleset.endDate.date)) : null
  return {
    id: promise.id,
    address: promise.address.toBase58(),
    state: promise.state,
    isOwner,
    promiseeWager,
    endDate,
    createdAt: promise.createdAt,
    createdBy: promise.promisor.toBase58(),
    updatedAt: promise.updatedAt,
    numberOfPromisees: promise.numberOfPromisees,
  }
}

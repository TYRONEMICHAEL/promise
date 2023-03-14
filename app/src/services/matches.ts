import { LAMPORTS_PER_SOL, PublicKey, TransactionInstruction } from '@solana/web3.js'
import { PromiseField } from 'promise-sdk/lib/sdk/src/promise/PromiseFilter'
import { PromiseProtocol } from 'promise-sdk/lib/sdk/src/promise/PromiseProtocol'
import { PromiseeField } from 'promise-sdk/lib/sdk/src/promisee/PromiseeFilter'
import { Promisor } from 'promise-sdk/lib/sdk/src/promisor/Promisor'
import { PromisorField } from 'promise-sdk/lib/sdk/src/promisor/PromisorFilter'
import { PromisorRuleset } from 'promise-sdk/lib/sdk/src/promisor/PromisorRuleset'
import { promiseInstance, promiseNetworkAddress, promiseNetworkPublicKey } from '../env'
import { Match, MatchDetails, MatchMetadata } from '../interfaces/matches'
import { Squad, SquadExecutionStatus } from '../interfaces/squads'
import { sendAndConfirm } from '../utils/helpers'
import { getConnection, getWallet } from './account'
import { pinMatchMetadata } from './ipfs'
import {
  executeInstructionForSquad,
  executeTransactionInstruction,
  getAuthorityKeyForSquad,
  getInstructionsForExecutingInstruction,
  getSquad,
  getSquads,
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

export const createMatch: (matchDetails: MatchDetails, squad?: Squad) => Promise<Match> = async (
  matchDetails: MatchDetails,
  squad?: Squad
) => {
  const wallet = getWallet()
  const promiseSDK = getPromiseSDK()
  const promisorRuleset = new PromisorRuleset()
  const promiseeRuleset = matchDetails.toRuleset()
  const promisor = await getPromisor()
  const instructions: TransactionInstruction[] = []
  let promisorPDA: PublicKey = promisor?.address
  let promisePDA: PublicKey = null
  let uri: string | null = null

  if (matchDetails.metadata) {
    const [hash] = await pinMatchMetadata(matchDetails.metadata)
    uri = hash
  }
  
  if (promisor) {
    promisePDA = promiseSDK.getPromisePDA(
      promiseNetworkPublicKey,
      promisor.address,
      promisor.numberOfPromises + 1
    )[0]
    instructions.push(
      await promiseSDK.buildCreatePromise(
        promisor.address,
        promiseNetworkPublicKey,
        promisor.numberOfPromises + 1,
        promisorRuleset,
        promiseeRuleset,
        wallet.publicKey,
        uri
      )
    )
    instructions.push(
      await promiseSDK.buildActivatePromise(promisePDA, promisor.address, wallet.publicKey)
    )
  } else {
    promisorPDA = promiseSDK.getPromisorPDA(promiseNetworkPublicKey, wallet.publicKey)[0]
    promisePDA = promiseSDK.getPromisePDA(promiseNetworkPublicKey, promisorPDA, 1)[0]
    instructions.push(await buildCreatePromisor())
    instructions.push(
      await promiseSDK.buildCreatePromise(
        promisorPDA,
        promiseNetworkPublicKey,
        1,
        promisorRuleset,
        promiseeRuleset,
        wallet.publicKey
      )
    )
    instructions.push(
      await promiseSDK.buildActivatePromise(promisePDA, promisorPDA, wallet.publicKey)
    )
  }

  let transactionPDA: PublicKey = null
  if (squad) {
    const creator = new PublicKey(squad.address)
    const owner = getAuthorityKeyForSquad(squad.address)
    const instruction = await promiseSDK.buildAcceptPromise(promisePDA, creator, owner)
    const [txPDA, acceptInstructions] = await getInstructionsForExecutingInstruction(
      squad,
      instruction
    )
    instructions.push(...acceptInstructions)
    transactionPDA = txPDA
  }

  await sendAndConfirm(instructions)

  if (squad && transactionPDA) {
    await executeTransactionInstruction(transactionPDA)
  }

  const promise = await promiseSDK.getPromise(promisePDA)
  return matchFromPromise(promise, promisor)
}

export const acceptMatch: (match: Match, squad: Squad) => Promise<SquadExecutionStatus> = async (
  match: Match,
  squad: Squad
) => {
  const promiseSDK = getPromiseSDK()
  const promise = new PublicKey(match.address)
  const creator = new PublicKey(squad.address)
  const owner = getAuthorityKeyForSquad(squad.address)
  const instruction = await promiseSDK.buildAcceptPromise(promise, creator, owner)
  return await executeInstructionForSquad(squad, instruction)
}

export const getSquadsForMatch: (match: Match) => Promise<Squad[]> = async (match: Match) => {
  const promiseSDK = getPromiseSDK()
  const promisees = await promiseSDK.getPromisees({
    field: PromiseeField.promise,
    value: match.address,
  })

  const filteredPromisees = await Promise.all(
    promisees.map((promisee) => getSquad(promisee.creator))
  )

  return filteredPromisees.filter((x) => x !== undefined)
}

export const getMatchesForSquad: (squad: Squad) => Promise<Match[]> = async (squad: Squad) => {
  const promiseSDK = getPromiseSDK()
  const promisor = await getPromisor()
  const promisees = await promiseSDK.getPromisees({
    field: PromiseeField.creator,
    value: squad.address,
  })

  const promises = await Promise.all(
    promisees.map((promisee) => promiseSDK.getPromise(promisee.promise))
  )

  return promises.map((promise) => matchFromPromise(promise, promisor))
}

export const getMatchesForUser: () => Promise<Match[]> = async () => {
  const squads = await getSquads()
  const matches = await Promise.all(squads.flatMap((squad) => getMatchesForSquad(squad)))
  return matches.flat()
}

export const completeMatch = async (
  match: Match,
  squad: Squad,
  matchMetada?: MatchMetadata
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

  let uri: string | null = null
  if (matchMetada) {
    const [hash] = await pinMatchMetadata(matchMetada)
    uri = hash
  }

  await promiseSDK.completePromise(promise, promisee, uri)
  return false
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

const buildCreatePromisor = async () => {
  const wallet = getWallet()
  const promiseSDK = getPromiseSDK()
  return await promiseSDK.buildCreatePromisor(promiseNetworkPublicKey, wallet.publicKey)
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
    uri: promise.uri,
  }
}

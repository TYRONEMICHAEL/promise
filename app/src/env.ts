import { AnchorProvider, Program } from '@project-serum/anchor'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { Cluster, Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'
import Squads, { DEFAULT_MULTISIG_PROGRAM_ID } from '@sqds/sdk'
import { IDL as SquadIDL, SquadsMpl } from '@sqds/sdk/lib/target/types/squads_mpl'
import { ExtendedCluster, PromiseSDK } from 'promise-sdk/lib/sdk/src/PromiseSDK'

// SOLANA
export const solanaWalletCluster = process.env.NEXT_PUBLIC_SOLANA_WALLET_CLUSTER
export const solanaWalletIsLocalnet = solanaWalletCluster == 'localnet'
export const solanaWalletCustomEndpoint = process.env.NEXT_PUBLIC_SOLANA_WALLET_ENDPOINT
export const solanaWalletEndpoint = solanaWalletIsLocalnet
  ? 'http://127.0.0.1:8899'
  : solanaWalletCustomEndpoint
  ? solanaWalletCustomEndpoint
  : clusterApiUrl(solanaWalletCluster as Cluster) 

// SQUADS PROTOCOL
export const squadsMultisigAddress = process.env.NEXT_PUBLIC_SQUADS_MULTISIG_ADDRESS
export const squadsMultisigPublicKey = squadsMultisigAddress && new PublicKey(squadsMultisigAddress)
export const squadsMultisigProgramID = solanaWalletIsLocalnet
  ? squadsMultisigPublicKey
  : DEFAULT_MULTISIG_PROGRAM_ID
export const squadsInstance = (wallet: WalletContextState) => {
  return Squads.endpoint(solanaWalletEndpoint, wallet, {
    multisigProgramId: squadsMultisigProgramID,
  })
}
export const squadsProgram = (connection: Connection, wallet: WalletContextState) => {
  const idl = SquadIDL
  return new Program<SquadsMpl>(
    idl,
    squadsMultisigProgramID,
    new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions())
  )
}

// PROMISE PROTOCOL
export const promiseNetworkAddress = process.env.NEXT_PUBLIC_PROMISE_NETWORK_ADDRESS
export const promiseNetworkPublicKey = new PublicKey(promiseNetworkAddress)
export const promiseInstance = (connection: Connection, wallet: WalletContextState) => {
  const programId = PromiseSDK.getProgramId(solanaWalletCluster as ExtendedCluster)
  return new PromiseSDK(connection, wallet, programId)
}

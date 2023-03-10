import { AnchorProvider, Program } from '@project-serum/anchor'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { Cluster, Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'
import Squads, { DEFAULT_MULTISIG_PROGRAM_ID } from '@sqds/sdk'
import { IDL, SquadsMpl } from '@sqds/sdk/lib/target/types/squads_mpl'
import { PromiseSDK } from 'promise-sdk/lib/sdk/src/PromiseSDK'

// SOLANA
export const solanaWalletCluster = process.env.NEXT_PUBLIC_SOLANA_WALLET_CLUSTER
export const solanaWalletIsLocalnet = solanaWalletCluster == 'localnet'
export const solanaWalletEndpoint = !solanaWalletIsLocalnet
  ? clusterApiUrl(solanaWalletCluster as Cluster)
  : 'http://127.0.0.1:8899'

// SQUADS PROTOCOL
export const squadsMultisigAddress = process.env.NEXT_PUBLIC_SQUADS_MULTISIG_ADDRESS
export const squadsMultisigPublicKey = squadsMultisigAddress && new PublicKey(squadsMultisigAddress)
export const squadsInstance = (wallet: WalletContextState) => {
  return Squads.endpoint(solanaWalletEndpoint, wallet, {
    multisigProgramId: solanaWalletIsLocalnet
      ? squadsMultisigPublicKey
      : DEFAULT_MULTISIG_PROGRAM_ID,
  })
}
export const squadsProgram = (connection: Connection, wallet: WalletContextState) => {
  const idl = IDL
  return new Program<SquadsMpl>(
    idl,
    solanaWalletIsLocalnet ? squadsMultisigPublicKey : DEFAULT_MULTISIG_PROGRAM_ID,
    new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions())
  )
}

// PROMISE PROTOCOL
export const promiseNetworkAddress = process.env.NEXT_PUBLIC_PROMISE_NETWORK_ADDRESS
export const promiseNetworkPublicKey = new PublicKey(promiseNetworkAddress)
export const promiseInstance = (connection: Connection, wallet: WalletContextState) => {
  switch (solanaWalletCluster) {
    case 'localnet':
      return PromiseSDK.localnet(wallet)
    case 'devnet':
      return PromiseSDK.devnet(wallet)
    case 'testnet':
      return PromiseSDK.testnet(wallet)
    case 'mainnet':
    case 'mainnet-beta':
      return PromiseSDK.mainnet(wallet)
    default:
      return PromiseSDK.localnet(wallet)
  }
}

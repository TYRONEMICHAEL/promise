import {
  BitwiseVerificationMethodFlag,
  DidSolIdentifier,
  DidSolService,
  ExtendedCluster,
  VerificationMethodType
} from '@identity.com/sol-did-client'
import { IDL, SolDid } from '@identity.com/sol-did-idl'
import { AnchorProvider, Program } from '@project-serum/anchor'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { solanaWalletCluster } from '../env'

export const getWalletBalance = async (connection: Connection, wallet: WalletContextState) => {
  const accountInfo = await connection.getAccountInfo(wallet.publicKey)
  if (!accountInfo) {
    return 0
  }

  return accountInfo.lamports / LAMPORTS_PER_SOL
}

export type Identifier = {
  name: string
  pubKey: PublicKey
}

export type IdentifiersAccount = {
  id: string
  identifiers: Identifier[]
}

const getDidServiceForWallet = async (connection: Connection, wallet: WalletContextState) => {
  const didSolIdentifier = DidSolIdentifier.create(
    wallet.publicKey,
    solanaWalletCluster as ExtendedCluster,
    'http://127.0.0.1:8899'
  )

  const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions())
  const idl = IDL
  const program = new Program<SolDid>(
    idl,
    new PublicKey('DdAhSd6AxRbPJ3s8f7Lut4TB2vpXMWqApy8w3MJHrdt5'),
    provider
  )
  return await DidSolService.buildFromAnchor(program, didSolIdentifier, provider, wallet)
}

export const getIdentifiersForWallet: (
  connection: Connection,
  wallet: WalletContextState
) => Promise<IdentifiersAccount> = async (connection: Connection, wallet: WalletContextState) => {
  const service = await getDidServiceForWallet(connection, wallet)
  let document = await service.getDidAccount()
  if (document == null) {
    await service.initialize(1000, wallet.publicKey).rpc()
    document = await service.getDidAccount();
  }

  const methods =
    document.verificationMethods.filter(
      (method) => method.keyData != wallet.publicKey.toBuffer()
    ) ?? []
  const identifiers = methods.map((method) => {
    return {
      name: method.fragment,
      pubKey: new PublicKey(method.keyData),
    }
  })
  return {
    id: document.identifier.toString(),
    identifiers: identifiers,
  }
}

export const addIdentifierToWallet = async (
  connection: Connection,
  wallet: WalletContextState,
  name: string,
  pubKey: PublicKey
) => {
  const service = await getDidServiceForWallet(connection, wallet)
  const response = await service
    .addVerificationMethod(
      {
        fragment: name,
        keyData: pubKey.toBuffer(),
        flags: [BitwiseVerificationMethodFlag.CapabilityInvocation],
        methodType: VerificationMethodType.Ed25519VerificationKey2018,
      },
      wallet.publicKey
    )
    .withSolWallet(wallet)
    .withAutomaticAlloc(wallet.publicKey)
    .rpc()

  console.log(response)
}

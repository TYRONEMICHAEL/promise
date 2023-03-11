import { DidSolIdentifier, DidSolService } from '@identity.com/sol-did-client'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { Connection, PublicKey } from '@solana/web3.js'

export const getWalletPublicKey = (wallet: WalletContextState, truncate = 6) => {
  const formattedPublicKey = wallet.publicKey?.toString()
  return `${formattedPublicKey?.substring(0, Math.min(formattedPublicKey.length, truncate))}...`
}

export const getSquadsForWallet = async (wallet: WalletContextState, connection: Connection): Promise<PublicKey[]> => {
  const didSolIdentifier = DidSolIdentifier.create(wallet.publicKey, 'devnet');
    const service = DidSolService.build(
      didSolIdentifier,
      {
        connection,
      }
    );

  const did = await service.resolve();
  return did.verificationMethod.filter((v) => v.id.includes("squad")).map((v) => new PublicKey(v.publicKeyBase58))
}
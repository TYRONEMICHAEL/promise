import { AnchorProvider, Program } from '@project-serum/anchor'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import Squads from '@sqds/sdk'
import { IDL, SquadsMpl } from '@sqds/sdk/lib/target/types/squads_mpl'

const maxNumberOfKeysPerSquad = 10

const createSquadsInstance = (wallet: WalletContextState) => {
  return Squads.localnet(wallet, {
    multisigProgramId: new PublicKey('3RVSoJHxueZnjyzdre6gW6ciNZKTv7hnhLL39eary5kB'),
    programManagerProgramId: new PublicKey('7bEk3wSumpeE5gDNx4b5pqvfn28nRWn6XfFWzVGiaDEP'),
  })
}

const getSquadsProgram = (connection: Connection, wallet: WalletContextState) => {
  const idl = IDL
  return new Program<SquadsMpl>(
    idl,
    new PublicKey('3RVSoJHxueZnjyzdre6gW6ciNZKTv7hnhLL39eary5kB'),
    new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions())
  )
}

export type Squad = {
  name: string
  // description: string
  // icon: string
  address: string
  members: string[]
}

export const getSquadsForWallet: (
  connection: Connection,
  wallet: WalletContextState
) => Promise<Squad[]> = async (connection: Connection, wallet: WalletContextState) => {
  const squadsProgram = getSquadsProgram(connection, wallet)
  const squadsPromises: Promise<any[]>[] = Array.from(Array(maxNumberOfKeysPerSquad).keys()).reduce(
    (result, current) => {
      return result.concat(
        squadsProgram.account.ms.all([
          {
            memcmp: {
              offset:
                8 + // Anchor discriminator
                2 + // threshold value
                2 + // authority index
                4 + // transaction index
                4 + // processed internal transaction index
                1 + // PDA bump
                32 + // creator
                1 + // allow external execute
                4 + // for vec length
                32 * current, // position of key
              bytes: wallet.publicKey.toBase58(),
            },
          },
        ])
      )
    },
    []
  )

  const squads = (await Promise.all(squadsPromises)).flat()
  return squads.map((squad, index) => {
    return {
      name: `Squad ${index}`,
      address: squad.publicKey.toBase58(),
      members: squad.account.keys.map(key => key.toBase58()),
    }
  })
}

export const createSquadForWallet: (
  wallet: WalletContextState,
  name: string,
  description: string,
  threshold: number,
  includeSelfAsMember: boolean,
  icon?: string,
  members?: string[]
) => Promise<Squad> = async (
  wallet: WalletContextState,
  name: string,
  description: string,
  threshold: number,
  includeSelfAsMember: boolean,
  icon?: string,
  members?: string[]
) => {
  console.log(members)
  const squads = createSquadsInstance(wallet)
  const createKey = Keypair.generate()
  const membersPubKeys = members?.filter(member => member.length > 0).map(member => new PublicKey(member)) ?? []
  const multiSig = await squads.createMultisig(
    threshold,
    createKey.publicKey,
    includeSelfAsMember ? membersPubKeys.concat(wallet.publicKey) : membersPubKeys,
    name,
    description,
    icon
  )

  return {
    name: "New Squad",
    address: multiSig.publicKey.toBase58(),
    members: multiSig.keys.map(key => key.toBase58()),
  }
}

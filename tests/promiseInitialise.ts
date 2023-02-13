// import { serialize } from "borsh";
import { AnchorProvider, BN, getProvider, Program, setProvider, utils, web3, workspace } from "@project-serum/anchor";
import { expect } from "chai";
import { Promise as PromiseAccount } from "../target/types/promise";
import { Keypair, PublicKey } from "@solana/web3.js";
import { EndDate, NftGate, Ruleset, StartDate } from "./schema";
import { serialize, deserialize } from "@dao-xyz/borsh";

const LAMPORTS_PER_SOL = 1000000000;

describe("promise", () => {
  setProvider(AnchorProvider.env());
  const program = workspace.Promise as Program<PromiseAccount>;

  it("A promise can be initialized", async () => {
    const { connection } = getProvider();
    const networkAuthority = web3.Keypair.generate();
    const promisorOwner = web3.Keypair.generate();
    
    const a1 = await connection.requestAirdrop(
      networkAuthority.publicKey,
      LAMPORTS_PER_SOL
    );

    const a2 = await connection.requestAirdrop(
      promisorOwner.publicKey,
      LAMPORTS_PER_SOL
    );

    const latestBlockHash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: a1,
    });

    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: a2,
    });

    const [networkAccount, networkAccountBump] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("promise_network"),
        networkAuthority.publicKey.toBuffer(), 
      ],
      program.programId
    );

    const ruleset = new Ruleset();
    const serialized = serialize(ruleset);

    await program.methods
      .initializeNetwork(serialized, networkAccountBump)
      .accounts({
        promiseNetwork: networkAccount,
        authority: networkAuthority.publicKey,
      })
      .signers([networkAuthority])
      .rpc();

    const [promisorAccount, promisorAccountBump] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("promisor"),
        networkAccount.toBuffer(),
        promisorOwner.publicKey.toBuffer(),
      ],
      program.programId
    );

    await program.methods
      .initializePromisor(promisorAccountBump)
      .accounts({
        promisor: promisorAccount,
        owner: promisorOwner.publicKey,
        promiseNetwork: networkAccount,
      })
      .signers([promisorOwner])
      .rpc();

    const promisor = await program.account.promisor.fetch(
      promisorAccount
    );

    const [promiseAccount, promiseAccountBump] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("promise"),
        networkAccount.toBuffer(),
        promisorAccount.toBuffer(),
        new BN(promisor.numPromises + 1).toArrayLike(Buffer, "le", 4),
      ],
      program.programId
    );

    await program.methods
      .initializePromise(serialized, new BN(0), promiseAccountBump)
      .accounts({
        promise: promiseAccount,
        promisor: promisorAccount,
        promiseNetwork: networkAccount,
        promisorOwner: promisorOwner.publicKey,
      })
      .signers([promisorOwner])
      .rpc();

    const updatedPromisor = await program.account.promisor.fetch(
      promisorAccount
    );

    expect(updatedPromisor.numPromises).to.equal(1);
  });
});

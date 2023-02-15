// import { serialize } from "borsh";
import { AnchorProvider, BN, getProvider, Program, setProvider, utils, web3, workspace } from "@project-serum/anchor";
import { expect } from "chai";
import { Promise as PromiseAccount } from "../target/types/promise";
import { PublicKey } from "@solana/web3.js";
import { PromiseRuleset, NetworkRuleset, StartDate } from "./schema";
import { serialize } from "@dao-xyz/borsh";

const LAMPORTS_PER_SOL = 1000000000;

describe.only("promise", () => {
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

    const networkRuleset = new NetworkRuleset();
    const networkSerialized = serialize(networkRuleset);

    await program.methods
      .initializeNetwork(networkSerialized, networkAccountBump)
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

    const promiseRuleset = new PromiseRuleset();
    const promiseSerialized = serialize(promiseRuleset);
    const endsAt = Math.floor((new Date()).getTime() / 1000);

    await program.methods
      .initializePromise(promiseSerialized, new BN(endsAt), promiseAccountBump)
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

    const promise = await program.account.promise.fetch(
      promiseAccount
    );
    
    expect(updatedPromisor.numPromises).to.equal(1);
    expect(promise.state["created"]).to.not.be.undefined;
    expect((new BN(promise.endsAt)).toNumber()).to.equal(endsAt);
    expect(promise.data).to.deep.equal(promiseSerialized);
    expect(promisor.numPromises).to.equal(0);
    expect(promise.createdAt).to.be.not.be.undefined;
    expect(promise.updatedAt).to.be.not.be.undefined;
    expect(promise.network.toBase58()).to.equal(networkAccount.toBase58());
    expect(promise.promisor.toBase58()).to.equal(promisorAccount.toBase58());
    expect(promise.bump).to.equal(promiseAccountBump);
  });
});

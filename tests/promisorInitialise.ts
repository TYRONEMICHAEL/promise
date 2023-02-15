// import { serialize } from "borsh";
import { AnchorProvider, getProvider, Program, setProvider, utils, web3, workspace } from "@project-serum/anchor";
import { expect } from "chai";
import { Promise as PromiseAccount } from "../target/types/promise";
import { PublicKey } from "@solana/web3.js";
import { EndDate, NetworkRuleset as Ruleset, StartDate } from "./schema";
import { serialize } from "@dao-xyz/borsh";

const LAMPORTS_PER_SOL = 1000000000;

describe("promise", () => {
  setProvider(AnchorProvider.env());
  const program = workspace.Promise as Program<PromiseAccount>;

  it("A promisor can be initialized with a set of network rules", async () => {
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

    const ruleset = new Ruleset(
      StartDate.fromDate(new Date(Date.now() - 86400000)),
    );

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

    expect(promisor.owner.toBase58()).to.equal(promisorOwner.publicKey.toBase58());
    expect(promisor.promiseNetwork.toBase58()).to.equal(networkAccount.toBase58());
    expect(promisor.state["active"]).to.not.be.undefined;
    expect(promisor.bump).to.equal(promisorAccountBump);
    expect(promisor.numPromises).to.equal(0);
  });
  
  it("A promisor cannot be initialized with a set of network rules", async () => {
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

    const ruleset = new Ruleset(
      undefined,
      EndDate.fromDate(new Date(Date.now() - 86400000)), // ended yesterday
    );

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

    try {
      await program.methods
        .initializePromisor(promisorAccountBump)
        .accounts({
          promisor: promisorAccount,
          owner: promisorOwner.publicKey,
          promiseNetwork: networkAccount,
        })
        .signers([promisorOwner])
      .rpc();

      throw new Error("Should not be able to initialize promisor");
    } catch (e) {
      expect(e.message).to.contain('PromisorAccountCreationExpired');
    }
  });
});

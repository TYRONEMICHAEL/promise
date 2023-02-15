// import { serialize } from "borsh";
import { AnchorProvider, getProvider, Program, setProvider, utils, web3, workspace } from "@project-serum/anchor";
import { expect } from "chai";
import { Promise as PromiseAccount } from "../target/types/promise";
import { Keypair, PublicKey } from "@solana/web3.js";
import { NetworkRuleset as Ruleset, StartDate } from "./schema";
import { serialize } from "@dao-xyz/borsh";

const LAMPORTS_PER_SOL = 1000000000;

describe("promise", () => {
  setProvider(AnchorProvider.env());
  const program = workspace.Promise as Program<PromiseAccount>;

  it("A promisor can be set to inactive", async () => {
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
    
    await program.methods.updatePromisor({ inActive: {} })
      .accounts({
        promisor: promisorAccount,
        owner: promisorOwner.publicKey,
        promiseNetwork: networkAccount,
        authority: networkAuthority.publicKey,
      })
      .signers([networkAuthority])
      .rpc();
    
    const promisor = await program.account.promisor.fetch(
      promisorAccount
    );
    
    expect(promisor.state["active"]).to.be.undefined;
    expect(promisor.state["inActive"]).to.not.be.undefined;
  });

  it("A promisor cannot be set to inactive with the incorrect authority", async () => {
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
    
    try {
      const unauthorizedAuthority = Keypair.generate();
      await program.methods.updatePromisor({ inActive: {} })
        .accounts({
          promisor: promisorAccount,
          owner: promisorOwner.publicKey,
          promiseNetwork: networkAccount,
          authority: unauthorizedAuthority.publicKey,
        })
        .signers([unauthorizedAuthority])
        .rpc();
    } catch (e) {
      expect(e.message).to.contain("A raw constraint was violated.");
    }
  });
});

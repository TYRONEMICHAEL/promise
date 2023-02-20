// import { serialize } from "borsh";
import { AnchorProvider, BN, getProvider, Program, setProvider, utils, web3, workspace } from "@project-serum/anchor";
import { expect } from "chai";
import { Promise as PromiseAccount } from "../target/types/promise";
import { Keypair, PublicKey } from "@solana/web3.js";
import { EndDate, NftGate, NetworkRuleset as Ruleset, StartDate } from "./schema";
import { serialize, deserialize } from "@dao-xyz/borsh";

const LAMPORTS_PER_SOL = 1000000000;

describe("promise", () => {
  setProvider(AnchorProvider.env());
  const program = workspace.Promise as Program<PromiseAccount>;

  it("A network with a set of rules can be initialised", async () => {
    const { connection } = getProvider();
    const authority = web3.Keypair.generate();
    const airdropSignature = await connection.requestAirdrop(
      authority.publicKey,
      LAMPORTS_PER_SOL
    );

    const latestBlockHash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: airdropSignature,
    });

    const [networkAccount, networkAccountBump] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("promise_network"),
        authority.publicKey.toBuffer(), 
      ],
      program.programId
    );

    const ruleset = new Ruleset(
      StartDate.fromDate(new Date()),
      EndDate.fromDate(new Date()),
      NftGate.fromPublicKey(web3.Keypair.generate().publicKey),
    );

    const serialized = serialize(ruleset);

    await program.methods
      .initializeNetwork(serialized, networkAccountBump)
      .accounts({
        promiseNetwork: networkAccount,
        authority: authority.publicKey,
      })
      .signers([authority])
      .rpc();

    const state = await program.account.promiseNetwork.fetch(
      networkAccount
    );
    
    const rules = deserialize(state.data as Uint8Array, Ruleset);

    expect(state.authority.toBase58()).to.equal(authority.publicKey.toBase58());
    expect(state.bump).to.equal(networkAccountBump);
    expect(new BN(rules.startDate.date).toNumber()).to.equal(ruleset.startDate.date);
    expect(new BN(rules.endDate.date).toNumber()).to.equal(ruleset.endDate.date);
  });

  it("A network with a subset of rules can be initialised", async () => {
    const { connection } = getProvider();
    const authority = web3.Keypair.generate();
    const airdropSignature = await connection.requestAirdrop(
      authority.publicKey,
      LAMPORTS_PER_SOL
    );

    const latestBlockHash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: airdropSignature,
    });

    const [networkAccount, networkAccountBump] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("promise_network"),
        authority.publicKey.toBuffer(), 
      ],
      program.programId
    );

    const ruleset = new Ruleset(
      StartDate.fromDate(new Date()),
    );

    const serialized = serialize(ruleset);

    await program.methods
      .initializeNetwork(serialized, networkAccountBump)
      .accounts({
        promiseNetwork: networkAccount,
        authority: authority.publicKey,
      })
      .signers([authority])
      .rpc();

    const state = await program.account.promiseNetwork.fetch(
      networkAccount
    );
    
    const rules = deserialize(state.data as Uint8Array, Ruleset);

    expect(state.authority.toBase58()).to.equal(authority.publicKey.toBase58());
    expect(state.bump).to.equal(networkAccountBump);
    expect(new BN(rules.startDate.date).toNumber()).to.equal(ruleset.startDate.date);
    expect(rules.endDate).to.not.exist;
  });

  it("Multiple networks can be initialised", async () => {
    const { connection } = getProvider();
    const authorityA = web3.Keypair.generate();
    const authorityB = web3.Keypair.generate();
    const airdropSignatureA = await connection.requestAirdrop(
      authorityA.publicKey,
      LAMPORTS_PER_SOL
    );

    const airdropSignatureB = await connection.requestAirdrop(
      authorityB.publicKey,
      LAMPORTS_PER_SOL
    );

    const latestBlockHash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: airdropSignatureA,
    });

    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: airdropSignatureB,
    });

    const [networkAccountA, networkAccountBumpA] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("promise_network"),
        authorityA.publicKey.toBuffer(), 
      ],
      program.programId
    );

    const [networkAccountB, networkAccountBumpB] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("promise_network"),
        authorityB.publicKey.toBuffer(), 
      ],
      program.programId
    );

    const ruleset = new Ruleset(
      StartDate.fromDate(new Date()),
    );

    const serialized = serialize(ruleset);

    const a = await program.methods
      .initializeNetwork(serialized, networkAccountBumpA)
      .accounts({
        promiseNetwork: networkAccountA,
        authority: authorityA.publicKey,
      })
      .instruction()

    const b = await program.methods
      .initializeNetwork(serialized, networkAccountBumpB)
      .accounts({
        promiseNetwork: networkAccountB,
        authority: authorityB.publicKey,
      })
      .instruction()

    const tx = new web3.Transaction();

    tx.add(a);
    tx.add(b);

    await web3.sendAndConfirmTransaction(connection, tx, [authorityA, authorityB]);

    const networkA = await program.account.promiseNetwork.fetch(
      networkAccountA
    );

    const networkB = await program.account.promiseNetwork.fetch(
      networkAccountB
    );

    expect(networkA.authority.toBase58()).to.equal(authorityA.publicKey.toBase58());
    expect(networkA.bump).to.equal(networkAccountBumpA);
    expect(networkB.authority.toBase58()).to.equal(authorityB.publicKey.toBase58());
    expect(networkB.bump).to.equal(networkAccountBumpB);
  });
});


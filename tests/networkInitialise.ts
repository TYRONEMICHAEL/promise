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
});


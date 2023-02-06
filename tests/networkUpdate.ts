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

  it("We can update a set of rules", async () => {
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

    const existingRules = deserialize(state.data as Uint8Array, Ruleset);

    const updatedRuleset = new Ruleset(
      existingRules.startDate,
      EndDate.fromDate(new Date()),
    );

    const updatedSerialized = serialize(updatedRuleset);
    
    await program.methods
      .updateNetwork(updatedSerialized)
      .accounts({
        promiseNetwork: networkAccount,
        authority: authority.publicKey,
      })
      .signers([authority])
      .rpc();

    const updatedState = await program.account.promiseNetwork.fetch(
      networkAccount
    );

    const rules = deserialize(updatedState.data as Uint8Array, Ruleset);
    expect(new BN(rules.startDate.date).toNumber()).to.equal(new BN(existingRules.startDate.date).toNumber());
    expect(new BN(rules.endDate.date).toNumber()).to.equal(updatedRuleset.endDate.date);
  });
});


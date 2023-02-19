import {
    Connection,
    Keypair,
    LAMPORTS_PER_SOL
} from "@solana/web3.js";
import { expect } from "chai";
import { PromiseSDK } from "../src/PromiseSDK";
import { Network } from "../src/types/Network";
import { NetworkRuleset } from "../src/types/NetworkRuleset";
import { Promisor, PromisorState } from "../src/types/Promisor";
import { RulesetDate } from "../src/types/rulesets/RulsetDate";

const spawn = require("child_process").spawn;
const program = require("../../target/idl/promise.json");

describe("PromiseSDK", () => {
  let promise: PromiseSDK;
  let authority: Keypair;

  let lastNetwork: Network;
  let lastPromisor: Promisor;

  before(async () => {
    promise = PromiseSDK.forLocal("/Users/justinguedes/.config/solana/id.json");
    authority = Keypair.generate();
    await topUpAccount(authority);
  });

  it("should initialise a local sdk and return program id", async () => {
    const programId = program.metadata.address;

    expect(promise.getProgramId().toBase58()).to.eq(programId);
  });

  describe("Networks", () => {
    describe("Creation", () => {
      it("should create a network", async () => {
        const ruleset = new NetworkRuleset(
          null,
          RulesetDate.fromDate(new Date()),
          null
        );

        const network = await promise.createNetwork(ruleset, authority);
        lastNetwork = network;

        expect(network.createdBy).to.eql(authority.publicKey);
        expect(network.ruleset.startDate).to.be.undefined;
        expect(network.ruleset.endDate).to.not.be.undefined;
        expect(network.ruleset.nftGate).to.be.undefined;
      });

      it("should update a network", async () => {
        const newRuleset = new NetworkRuleset(
          RulesetDate.fromDate(new Date()),
          null,
          null
        );

        const network = await promise.updateNetwork(
          lastNetwork,
          newRuleset,
          authority
        );
        lastNetwork = network;

        expect(network.createdBy).to.eql(authority.publicKey);
        expect(network.ruleset.startDate).to.not.be.undefined;
        expect(network.ruleset.endDate).to.be.undefined;
        expect(network.ruleset.nftGate).to.be.undefined;
      });
    });

    describe("Query", () => {
      it("should return list of networks", async () => {
        const result = await promise.getNetworks();

        expect(result.length).to.be.greaterThan(0);
      });

      it("should return a specific network", async () => {
        const result = await promise.getNetwork(lastNetwork.address);

        expect(result).to.eql(lastNetwork);
      });
    });
  });

  describe("Promisors", () => {
    describe("Creation", () => {
      it("should create a promisor", async () => {
        const promisor = await promise.createPromisor(lastNetwork, authority);
        lastPromisor = promisor;

        expect(promisor.network).to.eql(lastNetwork.address);
        expect(promisor.owner).to.eq(authority.publicKey);
        expect(promisor.numberOfPromises).to.eq(0);
        expect(promisor.state).to.eq(PromisorState.active);
      });

      it("should update promisor state", async () => {
        const promisor = await promise.updatePromisor(
          lastPromisor,
          PromisorState.inactive
        );

        expect(promisor.network).to.eql(lastNetwork.address);
        expect(promisor.owner).to.eq(authority.publicKey);
        expect(promisor.numberOfPromises).to.eq(0);
        expect(promisor.state).to.eq(PromisorState.inactive);
      });
    });

    describe("Query", () => {
        it("should return list of promisors", async () => {
            const result = await promise.getPromisors();
    
            expect(result.length).to.be.greaterThan(0);
          });
    
          it("should return a specific network", async () => {
            const result = await promise.getPromisor(lastPromisor.address);
    
            expect(result).to.eql(lastPromisor);
          });
    });
  });
});

async function topUpAccount(authority: Keypair) {
  const connection = new Connection("http://127.0.0.1:8899");
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
}

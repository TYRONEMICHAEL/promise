import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { expect } from "chai";
import { PromiseSDK } from "../src/PromiseSDK";
import { Network } from "../src/network/Network";
import { NetworkRuleset } from "../src/network/NetworkRuleset";
import { Promisor } from "../src/promisor/Promisor";
import { RulesetDate } from "../src/rules/RulsetDate";
import { PromiseProtocol } from "../src/promise/PromiseProtocol";
import { PromisorState } from "../src/promisor/PromisorState";
import { PromisorRuleset } from "../src/promisor/PromisorRuleset";
import { SolGate } from "../src/rules/SolGate";
import { PromiseeRuleset } from "../src/promisee/PromiseeRuleset";
import { PromiseState } from "../src/promise/PromiseState";

const spawn = require("child_process").spawn;
const program = require("../../target/idl/promise.json");

describe("PromiseSDK", () => {
  let promise: PromiseSDK;
  let authority: Keypair;

  let lastNetwork: Network;
  let lastPromisor: Promisor;
  let lastPromise: PromiseProtocol;

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
    describe("Write", () => {
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

    describe("Read", () => {
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
    describe("Write", () => {
      it("should create a promisor", async () => {
        const promisor = await promise.createPromisor(lastNetwork, authority);
        lastPromisor = promisor;

        expect(promisor.network).to.eql(lastNetwork.address);
        expect(promisor.owner).to.eql(authority.publicKey);
        expect(promisor.numberOfPromises).to.eq(0);
        expect(promisor.state).to.eq(PromisorState.active);
      });

      it("should update promisor state", async () => {
        const promisor = await promise.updatePromisor(
          lastPromisor,
          PromisorState.inactive,
          authority
        );
        lastPromisor = promisor;

        expect(promisor.network).to.eql(lastNetwork.address);
        expect(promisor.owner).to.eql(authority.publicKey);
        expect(promisor.numberOfPromises).to.eq(0);
        expect(promisor.state).to.eq(PromisorState.inactive);

        // Reset for the other tests to pass
        lastPromisor = await promise.updatePromisor(
          lastPromisor,
          PromisorState.active,
          authority
        );
      });
    });

    describe("Read", () => {
      it("should return list of promisors", async () => {
        const result = await promise.getPromisors();

        expect(result.length).to.be.greaterThan(0);
      });

      it("should return a specific promisor", async () => {
        const result = await promise.getPromisor(lastPromisor.address);

        expect(result).to.eql(lastPromisor);
      });
    });
  });

  describe("Promise", () => {
    describe("Write", () => {
      it("should create a promise", async () => {
        const promisorRuleset = new PromisorRuleset(new SolGate(1243));
        const promiseeRuleset = new PromiseeRuleset(new SolGate(1123));
        const result = await promise.createPromise(
          lastPromisor,
          promisorRuleset,
          promiseeRuleset,
          authority
        );
        lastPromise = result;

        expect(result.id).to.be.eql(1);
        expect(result.network).to.be.eql(lastPromisor.network);
        expect(result.promisor).to.be.eql(lastPromisor.address);
        expect(result.state).to.be.eql(PromiseState.created);
        expect(result.promisorRuleset.solReward).to.not.be.undefined;
        expect(result.promiseeRuleset.solWager).to.not.be.undefined;
        expect(result.numberOfPromisees).to.be.eql(0);
      });

      it("should update a promise", async () => {
        const promisorRuleset = new PromisorRuleset(new SolGate(5555));
        const promiseeRuleset = new PromiseeRuleset(null);
        const result = await promise.updatePromise(
          lastPromise,
          promisorRuleset,
          promiseeRuleset,
          authority
        );
        lastPromise = result;

        expect(result.id).to.be.eql(1);
        expect(result.network).to.be.eql(lastPromisor.network);
        expect(result.promisor).to.be.eql(lastPromisor.address);
        expect(result.state).to.be.eql(PromiseState.created);
        expect(result.promisorRuleset.solReward).to.not.be.undefined;
        expect(result.promiseeRuleset.solWager).to.be.undefined;
        expect(result.numberOfPromisees).to.be.eql(0);
      });
    });

    describe("Read", async () => {
        it("should return list of promises", async () => {
            const result = await promise.getPromises();
    
            expect(result.length).to.be.greaterThan(0);
          });
    
          it("should return a specific promise", async () => {
            const result = await promise.getPromise(lastPromise.address);
    
            expect(result).to.eql(lastPromise);
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

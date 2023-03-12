import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { expect } from "chai";
import { PromiseSDK } from "../src/PromiseSDK";
import { Network } from "../src/network/Network";
import { NetworkRuleset } from "../src/network/NetworkRuleset";
import { PromiseProtocol } from "../src/promise/PromiseProtocol";
import { PromiseState } from "../src/promise/PromiseState";
import { Promisee } from "../src/promisee/Promisee";
import { PromiseeRuleset } from "../src/promisee/PromiseeRuleset";
import { Promisor } from "../src/promisor/Promisor";
import { PromisorRuleset } from "../src/promisor/PromisorRuleset";
import { PromisorState } from "../src/promisor/PromisorState";
import { RulesetDate } from "../src/rules/RulsetDate";
import { SolGate } from "../src/rules/SolGate";

describe("PromiseSDK", () => {
  let promise: PromiseSDK;
  let authority: Keypair;

  let lastNetwork: Network;
  let lastPromisor: Promisor;
  let lastPromise: PromiseProtocol;
  let lastPromisee: Promisee;

  before(async () => {
    authority = Keypair.generate();
    promise = PromiseSDK.localnet(new NodeWallet(authority));
    await topUpAccount(authority);
  });

  it("should initialise a local sdk and return program id", async () => {
    const programId = "EPwTUQEDoSREqyG9kp4rn2NtxkumDoMGdGnACv6s8J3A";

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

        const network = await promise.createNetwork(ruleset);
        lastNetwork = network;

        expect(network.createdBy).to.eql(authority.publicKey);
        expect(network.ruleset.startDate).to.be.undefined;
        expect(network.ruleset.endDate).to.not.be.undefined;
        expect(network.ruleset.nftGate).to.be.undefined;
      });

      it("should update a network", async () => {
        const newRuleset = new NetworkRuleset(
          RulesetDate.fromDate(new Date(1676325600)),
          null,
          null
        );

        const network = await promise.updateNetwork(lastNetwork, newRuleset);
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
        const promisor = await promise.createPromisor(lastNetwork);
        lastPromisor = promisor;

        expect(promisor.network).to.eql(lastNetwork.address);
        expect(promisor.owner).to.eql(authority.publicKey);
        expect(promisor.numberOfPromises).to.eq(0);
        expect(promisor.state).to.eq(PromisorState.active);
      });

      it("should update promisor state", async () => {
        const promisor = await promise.updatePromisor(
          lastPromisor,
          PromisorState.inactive
        );
        lastPromisor = promisor;

        expect(promisor.network).to.eql(lastNetwork.address);
        expect(promisor.owner).to.eql(authority.publicKey);
        expect(promisor.numberOfPromises).to.eq(0);
        expect(promisor.state).to.eq(PromisorState.inactive);

        // Reset for the other tests to pass
        lastPromisor = await promise.updatePromisor(
          lastPromisor,
          PromisorState.active
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
        const promisorRuleset = new PromisorRuleset();
        const promiseeRuleset = new PromiseeRuleset();
        const result = await promise.createPromise(
          lastPromisor,
          promisorRuleset,
          promiseeRuleset
        );
        lastPromise = result;

        expect(result.id).to.be.eql(1);
        expect(result.network).to.be.eql(lastPromisor.network);
        expect(result.promisor).to.be.eql(lastPromisor.address);
        expect(result.state).to.be.eql(PromiseState.created);
        expect(result.promiseeRuleset.solWager).to.be.undefined;
        expect(result.promiseeRuleset.endDate).to.be.undefined;
        expect(result.numberOfPromisees).to.be.eql(0);
      });

      it("should update a promise rule", async () => {
        const promisorRuleset = new PromisorRuleset(new SolGate(5));
        const promiseeRuleset = lastPromise.promiseeRuleset;
        const result = await promise.updatePromise(
          lastPromise,
          promisorRuleset,
          promiseeRuleset
        );
        lastPromise = result;

        expect(result.id).to.be.eql(1);
        expect(result.network).to.be.eql(lastPromisor.network);
        expect(result.promisor).to.be.eql(lastPromisor.address);
        expect(result.state).to.be.eql(PromiseState.created);
        expect(result.promisorRuleset.solReward).to.not.be.undefined;
        expect(result.promiseeRuleset.endDate).to.be.undefined;
        expect(result.numberOfPromisees).to.be.eql(0);
      });

      it("should activate a promise", async () => {
        const result = await promise.activatePromise(lastPromise);
        lastPromise = result;

        expect(result.id).to.be.eql(1);
        expect(result.network).to.be.eql(lastPromisor.network);
        expect(result.promisor).to.be.eql(lastPromisor.address);
        expect(result.state).to.be.eql(PromiseState.active);
        expect(result.promisorRuleset.solReward).to.not.be.undefined;
        expect(result.promiseeRuleset.endDate).to.be.undefined;
        expect(result.numberOfPromisees).to.be.eql(0);
      });

      it("should accept a promise", async () => {
        const creator = Keypair.generate();
        const accountBalanceBefore = await getBalance(authority);
        const result = await promise.acceptPromise(
          lastPromise,
          creator.publicKey
        );
        lastPromisee = result;
        lastPromise = await promise.getPromise(lastPromise.address);
        const accountBalanceAfter = await getBalance(authority);

        expect(result.promise).to.be.eql(lastPromise.address);
        expect(result.owner).to.be.eql(authority.publicKey);
        expect(result.creator).to.be.eql(creator.publicKey);
        expect(lastPromise.numberOfPromisees).to.be.eql(1);
        expect(accountBalanceAfter).to.be.lessThan(accountBalanceBefore);
      });

      it("should complete a promise", async () => {
        const result = await promise.completePromise(lastPromise, lastPromisee);
        lastPromise = result;

        expect(result.id).to.be.eql(1);
        expect(result.network).to.be.eql(lastPromisor.network);
        expect(result.promisor).to.be.eql(lastPromisor.address);
        expect(result.state).to.be.eql(PromiseState.completed);
        expect(result.promisorRuleset.solReward).to.not.be.undefined;
        expect(result.promiseeRuleset.endDate).to.be.undefined;
        expect(result.numberOfPromisees).to.be.eql(1);
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

async function getBalance(authority: Keypair) {
  const connection = new Connection("http://127.0.0.1:8899");
  const accountInfo = await connection.getAccountInfo(authority.publicKey);
  return accountInfo.lamports;
}

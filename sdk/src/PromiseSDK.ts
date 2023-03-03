import fs from "fs";
import { AnchorProvider, Program } from "@project-serum/anchor";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { Promise as PromiseAccount } from "../../target/types/promise";
import { Network, createNetworkSeeds } from "./network/Network";
import { NetworkRuleset } from "./network/NetworkRuleset";
import { Promisor, createPromisorSeeds } from "./promisor/Promisor";
import {
  PromisorState,
  fromPromisorState,
  toPromisorState,
} from "./promisor/PromisorState";
import { PromiseProtocol, createPromiseSeeds } from "./promise/PromiseProtocol";
import { toPromiseState } from "./promise/PromiseState";
import { PromiseeRuleset } from "./promisee/PromiseeRuleset";
import { PromisorRuleset } from "./promisor/PromisorRuleset";
import { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { Promisee, createPromiseeSeeds } from "./promisee/Promisee";

const idl = require("./promise.json");
const programID = new PublicKey(idl.metadata.address);

export class PromiseSDK {
  program: Program<PromiseAccount>;
  wallet: Wallet;

  public constructor(connection: Connection, wallet: Wallet) {
    const provider = new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions()
    );
    this.program = new Program(idl, programID, provider);
    this.wallet = wallet;
  }

  public static forLocal(secretKeyPath: string): PromiseSDK {
    const connection = new Connection("http://127.0.0.1:8899");
    const secretKey = JSON.parse(fs.readFileSync(secretKeyPath).toString());
    const decodedSecretKey = new Uint8Array(secretKey);
    const keyPair = Keypair.fromSecretKey(decodedSecretKey);
    const wallet = new NodeWallet(keyPair);

    return new PromiseSDK(connection, wallet);
  }

  /**
   * ======================================================
   * GENERAL
   * =========================
   */

  public getProgramId(): PublicKey {
    return this.program.programId;
  }

  /**
   * ======================================================
   * NETWORKS
   * =========================
   */

  /**
   * Gets the specified Network using the public address.
   * @param pubKey Public key of the Network account.
   * @returns Network if it exists.
   */
  public async getNetwork(pubKey: PublicKey): Promise<Network | undefined> {
    const network = await this.program.account.promiseNetwork.fetch(pubKey);
    const ruleset = NetworkRuleset.fromData(network.data);
    return {
      address: pubKey,
      createdBy: network.authority,
      ruleset,
    };
  }

  /**
   * Gets all networks that are available on the program.
   * @returns Array of Networks.
   */
  public async getNetworks(): Promise<Network[]> {
    const networks = await this.program.account.promiseNetwork.all();
    return networks.map((network) => {
      const ruleset = NetworkRuleset.fromData(network.account.data);
      return {
        address: network.publicKey,
        createdBy: network.account.authority,
        ruleset,
        bump: network.account.bump,
      };
    });
  }

  /**
   * Initialises a Network on the program.
   * @param ruleset Rules for the Network.
   * @param customAuthority Ability to supply a custom authority.
   * @returns Newly created Network.
   */
  public async createNetwork(ruleset: NetworkRuleset): Promise<Network> {
    const data = ruleset.toData() as Buffer;
    const seeds = createNetworkSeeds(this.wallet.publicKey);
    const [networkAccount, networkBump] = PublicKey.findProgramAddressSync(
      seeds,
      this.getProgramId()
    );
    const signature = await this.program.methods
      .initializeNetwork(data, networkBump)
      .accounts({
        promiseNetwork: networkAccount,
        authority: this.wallet.publicKey,
      })
      .rpc();

    await this.confirmTransaction(signature);

    const network = await this.getNetwork(networkAccount);
    if (network == null)
      throw new Error("Failed to create network for unknown reason.");

    return network;
  }

  /**
   * Updates an existing Network with a new ruleset.
   * @param network Network to update.
   * @param ruleset Updated ruleset for the Network.
   * @returns Updated Network.
   */
  public async updateNetwork(
    network: Network,
    ruleset: NetworkRuleset
  ): Promise<Network> {
    const data = ruleset.toData();

    const signature = await this.program.methods
      .updateNetwork(data)
      .accounts({
        promiseNetwork: network.address,
        authority: this.wallet.publicKey,
      })
      .rpc();

    await this.confirmTransaction(signature);

    const updatedNetwork = await this.getNetwork(network.address);
    if (updatedNetwork == null)
      throw new Error("Failed to update network for unknown reason.");

    return updatedNetwork;
  }

  /**
   * ======================================================
   * PROMISORS
   * =========================
   */

  public async getPromisor(pubKey: PublicKey): Promise<Promisor | undefined> {
    const promisor = await this.program.account.promisor.fetch(pubKey);
    return {
      address: pubKey,
      owner: promisor.owner,
      network: promisor.promiseNetwork,
      state: toPromisorState(promisor.state),
      numberOfPromises: promisor.numPromises,
    };
  }

  public async getPromisors(): Promise<Promisor[]> {
    const promisors = await this.program.account.promisor.all();
    return promisors.map((promisor) => {
      return {
        address: promisor.publicKey,
        owner: promisor.account.owner,
        network: promisor.account.promiseNetwork,
        state: toPromisorState(promisor.account.state),
        numberOfPromises: promisor.account.numPromises,
      };
    });
  }

  public async createPromisor(network: Network): Promise<Promisor> {
    const seeds = createPromisorSeeds(network.address, this.wallet.publicKey);

    const [promisorAccount, promisorBump] = PublicKey.findProgramAddressSync(
      seeds,
      this.getProgramId()
    );

    const signature = await this.program.methods
      .initializePromisor(promisorBump)
      .accounts({
        promisor: promisorAccount,
        owner: this.wallet.publicKey,
        promiseNetwork: network.address,
      })
      .rpc();

    await this.confirmTransaction(signature);

    const promisor = await this.getPromisor(promisorAccount);

    if (promisor == null)
      throw new Error("Failed to create promisor for unknown reason.");

    return promisor;
  }

  public async updatePromisor(
    promisor: Promisor,
    state: PromisorState
  ): Promise<Promisor> {
    const signature = await this.program.methods
      .updatePromisor(fromPromisorState(state))
      .accounts({
        promisor: promisor.address,
        owner: this.wallet.publicKey,
        promiseNetwork: promisor.network,
        authority: this.wallet.publicKey,
      })
      .rpc();

    await this.confirmTransaction(signature);

    const updatePromisor = await this.getPromisor(promisor.address);
    if (updatePromisor == null)
      throw new Error("Failed to update promisor for unknown reason.");

    return updatePromisor;
  }

  /**
   * ======================================================
   * PROMISES
   * =========================
   */

  public async getPromise(
    pubKey: PublicKey
  ): Promise<PromiseProtocol | undefined> {
    const promise = await this.program.account.promise.fetch(pubKey);
    return {
      id: promise.id,
      address: pubKey,
      network: promise.network,
      promisor: promise.promisor,
      state: toPromiseState(promise.state),
      promiseeRuleset: PromiseeRuleset.fromData(promise.promiseeData),
      promisorRuleset: PromisorRuleset.fromData(promise.promisorData),
      numberOfPromisees: promise.numPromisees,
    };
  }

  public async getPromises(): Promise<PromiseProtocol[]> {
    const promises = await this.program.account.promise.all();
    return promises.map((promise) => {
      return {
        id: promise.account.id,
        address: promise.publicKey,
        network: promise.account.network,
        promisor: promise.account.promisor,
        state: toPromiseState(promise.account.state),
        promiseeRuleset: PromiseeRuleset.fromData(promise.account.promiseeData),
        promisorRuleset: PromisorRuleset.fromData(promise.account.promisorData),
        numberOfPromisees: promise.account.numPromisees,
      };
    });
  }

  public async createPromise(
    promisor: Promisor,
    promisorRuleset: PromisorRuleset,
    promiseeRuleset: PromiseeRuleset
  ): Promise<PromiseProtocol> {
    const id = promisor.numberOfPromises + 1;
    const promisorData = promisorRuleset.toData();
    const promiseeData = promiseeRuleset.toData();
    const seeds = createPromiseSeeds(promisor.network, promisor.address, id);

    const [promiseAccount, promiseBump] =
      await PublicKey.findProgramAddressSync(seeds, this.getProgramId());

    const signature = await this.program.methods
      .initializePromise(id, promisorData, promiseeData, promiseBump)
      .accounts({
        promise: promiseAccount,
        promisor: promisor.address,
        promiseNetwork: promisor.network,
        promisorOwner: this.wallet.publicKey,
      })
      .remainingAccounts([
        {
          pubkey: this.wallet.publicKey,
          isWritable: true,
          isSigner: true,
        },
      ])
      .rpc();

    await this.confirmTransaction(signature);

    const promise = await this.getPromise(promiseAccount);

    if (promise == null)
      throw new Error("Failed to create promise for unknown reason.");

    return promise;
  }

  public async updatePromise(
    promise: PromiseProtocol,
    promisorRuleset: PromisorRuleset,
    promiseeRuleset: PromiseeRuleset
  ): Promise<PromiseProtocol> {
    const promisorData = promisorRuleset.toData();
    const promiseeData = promiseeRuleset.toData();

    const signature = await this.program.methods
      .updatePromiseRules(promisorData, promiseeData)
      .accounts({
        promise: promise.address,
        promisor: promise.promisor,
        promisorOwner: this.wallet.publicKey,
      })
      .remainingAccounts([
        {
          pubkey: this.wallet.publicKey,
          isWritable: true,
          isSigner: true,
        },
      ])
      .rpc();

    await this.confirmTransaction(signature);

    const updatedPromise = await this.getPromise(promise.address);

    if (updatedPromise == null)
      throw new Error("Failed to update promise for unknown reason.");

    return updatedPromise;
  }

  public async activatePromise(
    promise: PromiseProtocol
  ): Promise<PromiseProtocol> {
    const signature = await this.program.methods
      .updatePromiseActive()
      .accounts({
        promise: promise.address,
        promisor: promise.promisor,
        promisorOwner: this.wallet.publicKey,
      })
      .remainingAccounts([
        {
          pubkey: this.wallet.publicKey,
          isWritable: true,
          isSigner: true,
        },
        {
          pubkey: SystemProgram.programId,
          isWritable: false,
          isSigner: false,
        },
      ])
      .rpc();

    await this.confirmTransaction(signature);

    const activatedPromise = await this.getPromise(promise.address);

    if (activatedPromise == null)
      throw new Error("Failed to activate promise for unknown reason.");

    return activatedPromise;
  }

  public async acceptPromise(promise: PromiseProtocol): Promise<Promisee> {
    const seeds = createPromiseeSeeds(promise.address, this.wallet.publicKey);

    const [promiseeAccount, promiseeBump] =
      await PublicKey.findProgramAddressSync(seeds, this.getProgramId());

    const signature = await this.program.methods
      .updatePromiseAccept(promiseeBump)
      .accounts({
        promisee: promiseeAccount,
        promiseeOwner: this.wallet.publicKey,
        promise: promise.address,
      })
      .rpc();

    await this.confirmTransaction(signature);

    const promisee = await this.getPromisee(promiseeAccount);

    if (promisee == null)
      throw new Error("Failed to accept promise for unknown reason.");

    return promisee;
  }

  public async acceptPromiseInstruction(
    promise: PromiseProtocol,
    owner: PublicKey
  ): Promise<TransactionInstruction> {
    const seeds = createPromiseeSeeds(promise.address, owner);

    const [promiseeAccount, promiseeBump] =
      await PublicKey.findProgramAddressSync(seeds, this.getProgramId());

    return await this.program.methods
      .updatePromiseAccept(promiseeBump)
      .accounts({
        promisee: promiseeAccount,
        promiseeOwner: owner,
        promise: promise.address,
      })
      .instruction();
  }

  public async completePromise(
    promise: PromiseProtocol,
    promisee: Promisee
  ): Promise<PromiseProtocol> {
    const signature = await this.program.methods
      .updatePromiseCompleted()
      .accounts({
        promisee: promisee.address,
        promisor: promise.promisor,
        promisorOwner: this.wallet.publicKey,
        promise: promise.address,
      })
      .remainingAccounts([
        {
          pubkey: this.wallet.publicKey,
          isWritable: true,
          isSigner: false,
        },
        {
          pubkey: SystemProgram.programId,
          isWritable: false,
          isSigner: false,
        },
      ])
      .rpc();

    await this.confirmTransaction(signature);

    const completedPromise = await this.getPromise(promise.address);

    if (completedPromise == null)
      throw new Error("Failed to complete promise for unknown reason.");

    return completedPromise;
  }

  /**
   * ======================================================
   * PROMISEES
   * =========================
   */

  public async getPromisee(pubKey: PublicKey): Promise<Promisee | undefined> {
    const promisee = await this.program.account.promisee.fetch(pubKey);
    return {
      address: pubKey,
      promise: promisee.promise,
      owner: promisee.owner,
      createdAt: new Date(promisee.createdAt.toNumber()),
      updatedAt: new Date(promisee.updatedAt.toNumber()),
      bump: promisee.bump,
    };
  }

  public async getPromisees(): Promise<Promisee[]> {
    const promisees = await this.program.account.promisee.all();
    return promisees.map((promisee) => {
      return {
        address: promisee.publicKey,
        promise: promisee.account.promise,
        owner: promisee.account.owner,
        createdAt: new Date(promisee.account.createdAt.toNumber()),
        updatedAt: new Date(promisee.account.updatedAt.toNumber()),
        bump: promisee.account.bump,
      };
    });
  }

  /**
   * ======================================================
   * PRIVATE
   * =========================
   */

  private async confirmTransaction(signature: string): Promise<void> {
    const connection = this.program.provider.connection;
    const latestBlockHash = await connection.getLatestBlockhash();
    const result = await connection.confirmTransaction(
      {
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature,
      },
      "finalized"
    );

    if (result.value.err != null) {
      throw result.value.err;
    }
  }
}

import { AnchorProvider, Program } from "@project-serum/anchor";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import {
  ConfirmOptions,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import fs from "fs";
import { Promise as PromiseAccount } from "../../target/types/promise";
import { Network, createNetworkSeeds } from "./network/Network";
import { NetworkRuleset } from "./network/NetworkRuleset";
import { PromiseFilter, fromPromiseFilter } from "./promise/PromiseFilter";
import { PromiseProtocol, createPromiseSeeds } from "./promise/PromiseProtocol";
import { toPromiseState } from "./promise/PromiseState";
import { Promisee, createPromiseeSeeds } from "./promisee/Promisee";
import { PromiseeFilter, fromPromiseeFilter } from "./promisee/PromiseeFilter";
import { PromiseeRuleset } from "./promisee/PromiseeRuleset";
import { Promisor, createPromisorSeeds } from "./promisor/Promisor";
import { PromisorFilter, fromPromisorFilter } from "./promisor/PromisorFilter";
import { PromisorRuleset } from "./promisor/PromisorRuleset";
import {
  PromisorState,
  fromPromisorState,
  toPromisorState,
} from "./promisor/PromisorState";
import { MethodsBuilder } from "@project-serum/anchor/dist/cjs/program/namespace/methods";
import { AllInstructions } from "@project-serum/anchor/dist/cjs/program/namespace/types";

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
    const [method, networkAccount] = this._buildCreateNetwork(
      ruleset,
      this.wallet.publicKey
    );

    const signature = await method.rpc();
    await this.confirmTransaction(signature);
    const network = await this.getNetwork(networkAccount);
    if (network == null)
      throw new Error("Failed to create network for unknown reason.");

    return network;
  }

  public async buildCreateNetwork(
    ruleset: NetworkRuleset,
    owner: PublicKey
  ): Promise<TransactionInstruction> {
    return await this._buildCreateNetwork(ruleset, owner)[0].instruction();
  }

  private _buildCreateNetwork(
    ruleset: NetworkRuleset,
    owner: PublicKey
  ): [PromiseMethods, PublicKey] {
    const data = ruleset.toData() as Buffer;
    const seeds = createNetworkSeeds(owner);
    const [networkAccount, networkBump] = PublicKey.findProgramAddressSync(
      seeds,
      this.getProgramId()
    );
    return [
      this.program.methods.initializeNetwork(data, networkBump).accounts({
        promiseNetwork: networkAccount,
        authority: owner,
      }),
      networkAccount,
    ];
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
    const signature = await this._buildUpdateNetwork(
      network,
      ruleset,
      this.wallet.publicKey
    ).rpc();

    await this.confirmTransaction(signature);
    const updatedNetwork = await this.getNetwork(network.address);
    if (updatedNetwork == null)
      throw new Error("Failed to update network for unknown reason.");

    return updatedNetwork;
  }

  public async buildUpdateNetwork(
    network: Network,
    ruleset: NetworkRuleset,
    owner: PublicKey
  ): Promise<TransactionInstruction> {
    return await this._buildUpdateNetwork(
      network,
      ruleset,
      owner
    ).instruction();
  }

  private _buildUpdateNetwork(
    network: Network,
    ruleset: NetworkRuleset,
    owner: PublicKey
  ): PromiseMethods {
    const data = ruleset.toData();

    return this.program.methods.updateNetwork(data).accounts({
      promiseNetwork: network.address,
      authority: owner,
    });
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

  public async getPromisors(filter?: PromisorFilter): Promise<Promisor[]> {
    const filters = fromPromisorFilter(filter);
    const promisors = await this.program.account.promisor.all(filters);
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
    const [method, promisorAccount] = this._buildCreatePromisor(
      network,
      this.wallet.publicKey
    );

    const signature = await method.rpc();
    await this.confirmTransaction(signature);
    const promisor = await this.getPromisor(promisorAccount);
    if (promisor == null)
      throw new Error("Failed to create promisor for unknown reason.");

    return promisor;
  }

  public async buildCreatePromisor(
    network: Network,
    owner: PublicKey
  ): Promise<TransactionInstruction> {
    return await this._buildCreatePromisor(network, owner)[0].instruction();
  }

  private _buildCreatePromisor(
    network: Network,
    owner: PublicKey
  ): [PromiseMethods, PublicKey] {
    const seeds = createPromisorSeeds(network.address, owner);

    const [promisorAccount, promisorBump] = PublicKey.findProgramAddressSync(
      seeds,
      this.getProgramId()
    );

    return [
      this.program.methods.initializePromisor(promisorBump).accounts({
        promisor: promisorAccount,
        owner: owner,
        promiseNetwork: network.address,
      }),
      promisorAccount,
    ];
  }

  public async updatePromisor(
    promisor: Promisor,
    state: PromisorState
  ): Promise<Promisor> {
    const signature = await this._buildUpdatePromisor(
      promisor,
      state,
      this.wallet.publicKey
    ).rpc();

    await this.confirmTransaction(signature);
    const updatePromisor = await this.getPromisor(promisor.address);
    if (updatePromisor == null)
      throw new Error("Failed to update promisor for unknown reason.");

    return updatePromisor;
  }

  public async buildUpdatePromisor(
    promisor: Promisor,
    state: PromisorState,
    owner: PublicKey
  ): Promise<TransactionInstruction> {
    return await this._buildUpdatePromisor(
      promisor,
      state,
      owner
    ).instruction();
  }

  private _buildUpdatePromisor(
    promisor: Promisor,
    state: PromisorState,
    owner: PublicKey
  ): PromiseMethods {
    return this.program.methods
      .updatePromisor(fromPromisorState(state))
      .accounts({
        promisor: promisor.address,
        owner: owner,
        promiseNetwork: promisor.network,
        authority: owner,
      });
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

  public async getPromises(filter?: PromiseFilter): Promise<PromiseProtocol[]> {
    const filters = fromPromiseFilter(filter);
    const promises = await this.program.account.promise.all(filters);
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
    const [method, promiseAccount] = this._buildCreatePromise(
      promisor,
      promisorRuleset,
      promiseeRuleset,
      this.wallet.publicKey
    );

    const signature = await method.rpc();
    await this.confirmTransaction(signature);
    const promise = await this.getPromise(promiseAccount);
    if (promise == null)
      throw new Error("Failed to create promise for unknown reason.");

    return promise;
  }

  public async buildCreatePromise(
    promisor: Promisor,
    promisorRuleset: PromisorRuleset,
    promiseeRuleset: PromiseeRuleset,
    owner: PublicKey
  ): Promise<TransactionInstruction> {
    return await this._buildCreatePromise(
      promisor,
      promisorRuleset,
      promiseeRuleset,
      owner
    )[0].instruction();
  }

  private _buildCreatePromise(
    promisor: Promisor,
    promisorRuleset: PromisorRuleset,
    promiseeRuleset: PromiseeRuleset,
    owner: PublicKey
  ): [PromiseMethods, PublicKey] {
    const id = promisor.numberOfPromises + 1;
    const promisorData = promisorRuleset.toData();
    const promiseeData = promiseeRuleset.toData();
    const seeds = createPromiseSeeds(promisor.network, promisor.address, id);

    const [promiseAccount, promiseBump] = PublicKey.findProgramAddressSync(
      seeds,
      this.getProgramId()
    );

    return [
      this.program.methods
        .initializePromise(id, promisorData, promiseeData, promiseBump)
        .accounts({
          promise: promiseAccount,
          promisor: promisor.address,
          promiseNetwork: promisor.network,
          promisorOwner: owner,
        })
        .remainingAccounts([
          {
            pubkey: owner,
            isWritable: true,
            isSigner: true,
          },
        ]),
      promiseAccount,
    ];
  }

  public async updatePromise(
    promise: PromiseProtocol,
    promisorRuleset: PromisorRuleset,
    promiseeRuleset: PromiseeRuleset
  ): Promise<PromiseProtocol> {
    const signature = await this._buildUpdatePromise(
      promise,
      promisorRuleset,
      promiseeRuleset,
      this.wallet.publicKey
    ).rpc();

    await this.confirmTransaction(signature);
    const updatedPromise = await this.getPromise(promise.address);
    if (updatedPromise == null)
      throw new Error("Failed to update promise for unknown reason.");

    return updatedPromise;
  }

  public async buildUpdatePromise(
    promise: PromiseProtocol,
    promisorRuleset: PromisorRuleset,
    promiseeRuleset: PromiseeRuleset,
    owner: PublicKey
  ): Promise<TransactionInstruction> {
    return await this._buildUpdatePromise(
      promise,
      promisorRuleset,
      promiseeRuleset,
      owner
    ).instruction();
  }

  private _buildUpdatePromise(
    promise: PromiseProtocol,
    promisorRuleset: PromisorRuleset,
    promiseeRuleset: PromiseeRuleset,
    owner: PublicKey
  ): PromiseMethods {
    const promisorData = promisorRuleset.toData();
    const promiseeData = promiseeRuleset.toData();

    return this.program.methods
      .updatePromiseRules(promisorData, promiseeData)
      .accounts({
        promise: promise.address,
        promisor: promise.promisor,
        promisorOwner: owner,
      })
      .remainingAccounts([
        {
          pubkey: owner,
          isWritable: true,
          isSigner: true,
        },
      ]);
  }

  public async activatePromise(
    promise: PromiseProtocol
  ): Promise<PromiseProtocol> {
    const signature = await this._buildActivatePromise(
      promise,
      this.wallet.publicKey
    ).rpc();

    await this.confirmTransaction(signature);
    const activatedPromise = await this.getPromise(promise.address);
    if (activatedPromise == null)
      throw new Error("Failed to activate promise for unknown reason.");

    return activatedPromise;
  }

  public async buildActivatePromise(
    promise: PromiseProtocol,
    owner: PublicKey
  ): Promise<TransactionInstruction> {
    return await this._buildActivatePromise(promise, owner).instruction();
  }

  private _buildActivatePromise(
    promise: PromiseProtocol,
    owner: PublicKey
  ): PromiseMethods {
    return this.program.methods
      .updatePromiseActive()
      .accounts({
        promise: promise.address,
        promisor: promise.promisor,
        promisorOwner: owner,
      })
      .remainingAccounts([
        {
          pubkey: owner,
          isWritable: true,
          isSigner: true,
        },
        {
          pubkey: SystemProgram.programId,
          isWritable: false,
          isSigner: false,
        },
      ]);
  }

  public async acceptPromise(promise: PromiseProtocol): Promise<Promisee> {
    const [method, promiseeAccount] = this._buildAcceptPromise(
      promise,
      this.wallet.publicKey
    );

    const signature = await method.rpc();
    await this.confirmTransaction(signature);
    const promisee = await this.getPromisee(promiseeAccount);
    if (promisee == null)
      throw new Error("Failed to accept promise for unknown reason.");

    return promisee;
  }

  public async buildAcceptPromise(
    promise: PromiseProtocol,
    owner: PublicKey
  ): Promise<TransactionInstruction> {
    return await this._buildAcceptPromise(promise, owner)[0].instruction();
  }

  private _buildAcceptPromise(
    promise: PromiseProtocol,
    owner: PublicKey
  ): [PromiseMethods, PublicKey] {
    const seeds = createPromiseeSeeds(promise.address, owner);
    const [promiseeAccount, promiseeBump] = PublicKey.findProgramAddressSync(
      seeds,
      this.getProgramId()
    );

    return [
      this.program.methods
        .updatePromiseAccept(promiseeBump)
        .accounts({
          promisee: promiseeAccount,
          promiseeOwner: owner,
          promise: promise.address,
        })
        .remainingAccounts([
          {
            pubkey: owner,
            isSigner: true,
            isWritable: true,
          },
          {
            pubkey: SystemProgram.programId,
            isWritable: false,
            isSigner: false,
          },
        ]),
      promiseeAccount,
    ];
  }

  public async completePromise(
    promise: PromiseProtocol,
    promisee: Promisee
  ): Promise<PromiseProtocol> {
    const signature = await this._buildCompletePromise(
      promise,
      promisee,
      this.wallet.publicKey
    ).rpc();

    await this.confirmTransaction(signature);
    const completedPromise = await this.getPromise(promise.address);
    if (completedPromise == null)
      throw new Error("Failed to complete promise for unknown reason.");

    return completedPromise;
  }

  public async buildCompletePromise(
    promise: PromiseProtocol,
    promisee: Promisee,
    owner: PublicKey
  ): Promise<TransactionInstruction> {
    return await this._buildCompletePromise(
      promise,
      promisee,
      owner
    ).instruction();
  }

  private _buildCompletePromise(
    promise: PromiseProtocol,
    promisee: Promisee,
    owner: PublicKey
  ): PromiseMethods {
    return this.program.methods
      .updatePromiseCompleted()
      .accounts({
        promisee: promisee.address,
        promisor: promise.promisor,
        promisorOwner: owner,
        promise: promise.address,
      })
      .remainingAccounts([
        {
          pubkey: owner,
          isWritable: true,
          isSigner: false,
        },
        {
          pubkey: SystemProgram.programId,
          isWritable: false,
          isSigner: false,
        },
      ]);
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

  public async getPromisees(filter?: PromiseeFilter): Promise<Promisee[]> {
    const filters = fromPromiseeFilter(filter);
    const promisees = await this.program.account.promisee.all(filters);
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

export type PromiseMethods = MethodsBuilder<
  PromiseAccount,
  AllInstructions<PromiseAccount>
>;

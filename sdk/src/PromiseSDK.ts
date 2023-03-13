import { AnchorProvider, Program } from "@project-serum/anchor";
import { MethodsBuilder } from "@project-serum/anchor/dist/cjs/program/namespace/methods";
import { AllInstructions } from "@project-serum/anchor/dist/cjs/program/namespace/types";
import { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import {
  Cluster,
  Connection,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  clusterApiUrl,
} from "@solana/web3.js";
import { Promise as PromiseAccount } from "../../target/types/promise";
import { IDL } from "./idl/promise";
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

export type ExtendedCluster = "localnet" | Cluster;

const programIDs: Record<ExtendedCluster, string> = {
  localnet: "EPwTUQEDoSREqyG9kp4rn2NtxkumDoMGdGnACv6s8J3A",
  devnet: "DB5HAVRLPUYfUcAKK8A57JAihfZvcT3q17wNESfVb4AP",
  testnet: "EPwTUQEDoSREqyG9kp4rn2NtxkumDoMGdGnACv6s8J3A",
  "mainnet-beta": "TODO",
};

export class PromiseSDK {
  program: Program<PromiseAccount>;
  wallet: Wallet;

  public constructor(
    connection: Connection,
    wallet: Wallet,
    programID: PublicKey
  ) {
    const provider = new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions()
    );
    this.program = new Program(IDL, programID, provider);
    this.wallet = wallet;
  }

  public static localnet(wallet: Wallet): PromiseSDK {
    return this.create(wallet, "localnet");
  }

  public static devnet(wallet: Wallet): PromiseSDK {
    return this.create(wallet, "devnet");
  }

  public static testnet(wallet: Wallet): PromiseSDK {
    return this.create(wallet, "testnet");
  }

  public static mainnet(wallet: Wallet): PromiseSDK {
    return this.create(wallet, "mainnet-beta");
  }

  public static getProgramId(env: ExtendedCluster): PublicKey {
    return new PublicKey(programIDs[env] as string);
  }

  private static create(wallet: Wallet, env: ExtendedCluster): PromiseSDK {
    const endpoint =
      env == "localnet"
        ? "http://127.0.0.1:8899"
        : clusterApiUrl(env as Cluster);
    const connection = new Connection(endpoint);
    const programID = new PublicKey(programIDs[env] as string);
    return new PromiseSDK(connection, wallet, programID);
  }

  /**
   * ======================================================
   * GENERAL
   * =========================
   */

  /**
   * Returns the Program ID of the Promise protocol.
   * @returns Public Key of the Promise protocol.
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
   * Gets the public key and bump of a Network based on owner.
   * @param owner Owner of the Network.
   * @returns Public key and bump of the Network.
   */
  public getNetworkPDA(owner: PublicKey): [PublicKey, number] {
    const seeds = createNetworkSeeds(owner);
    return PublicKey.findProgramAddressSync(seeds, this.getProgramId());
  }

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
   * Gets all Networks that are available on the program.
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

  /**
   * Builds an instruction that will initialise a Network.
   * @param ruleset Rules for the Network.
   * @param owner Owner that will create the Network and be charged.
   * @returns An instruction that will initialise a Network.
   */
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
    const [networkAccount, networkBump] = this.getNetworkPDA(owner);
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
      network.address,
      ruleset,
      this.wallet.publicKey
    ).rpc();

    await this.confirmTransaction(signature);
    const updatedNetwork = await this.getNetwork(network.address);
    if (updatedNetwork == null)
      throw new Error("Failed to update network for unknown reason.");

    return updatedNetwork;
  }

  /**
   * Builds an instruction to update an existing Network with a new ruleset.
   * @param network Network to update.
   * @param ruleset Updated ruleset for the Network.
   * @param owner The owner of the Network.
   * @returns Instruction that updates the Network.
   */
  public async buildUpdateNetwork(
    network: PublicKey,
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
    network: PublicKey,
    ruleset: NetworkRuleset,
    owner: PublicKey
  ): PromiseMethods {
    const data = ruleset.toData();

    return this.program.methods.updateNetwork(data).accounts({
      promiseNetwork: network,
      authority: owner,
    });
  }

  /**
   * ======================================================
   * PROMISORS
   * =========================
   */

  /**
   * Gets the public key and bump of a Promisor based on Network and owner.
   * @param network Address of Network.
   * @param owner Owner of the Promisor.
   * @returns Public key and bump of the Promisor.
   */
  public getPromisorPDA(
    network: PublicKey,
    owner: PublicKey
  ): [PublicKey, number] {
    const seeds = createPromisorSeeds(network, owner);
    return PublicKey.findProgramAddressSync(seeds, this.getProgramId());
  }

  /**
   * Gets the specified Promisor using the public address.
   * @param pubKey Public key of the Promisor account.
   * @returns Promisor if it exists.
   */
  public async getPromisor(pubKey: PublicKey): Promise<Promisor | undefined> {
    const promisor = await this.program.account.promisor.fetch(pubKey);
    return {
      address: pubKey,
      owner: promisor.owner,
      network: promisor.promiseNetwork,
      state: toPromisorState(promisor.state),
      numberOfPromises: promisor.numPromises,
      updatedAt: new Date(promisor.updatedAt.toNumber() * 1000),
    };
  }

  /**
   * Gets all Promisors that are available on the program.
   * @param filter Filter to narrow down the list of Promisors.
   * @returns Array of Promisors.
   */
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
        updatedAt: new Date(promisor.account.updatedAt.toNumber() * 1000),
      };
    });
  }

  /**
   * Creates a Promisor on the Network.
   * @param network Network the Promisor will belong to.
   * @returns Newly created Promisor.
   */
  public async createPromisor(network: Network): Promise<Promisor> {
    const [method, promisorAccount] = this._buildCreatePromisor(
      network.address,
      this.wallet.publicKey
    );

    const signature = await method.rpc();
    await this.confirmTransaction(signature);
    const promisor = await this.getPromisor(promisorAccount);
    if (promisor == null)
      throw new Error("Failed to create promisor for unknown reason.");

    return promisor;
  }

  /**
   * Builds an instruction that creates a Promisor on a Network.
   * @param network Network the Promisor will belong to.
   * @param owner The owner of the Promisor.
   * @returns An instruction that creates a Promisor.
   */
  public async buildCreatePromisor(
    network: PublicKey,
    owner: PublicKey
  ): Promise<TransactionInstruction> {
    return await this._buildCreatePromisor(network, owner)[0].instruction();
  }

  private _buildCreatePromisor(
    network: PublicKey,
    owner: PublicKey
  ): [PromiseMethods, PublicKey] {
    const [promisorAccount, promisorBump] = this.getPromisorPDA(network, owner);
    return [
      this.program.methods.initializePromisor(promisorBump).accounts({
        promisor: promisorAccount,
        owner: owner,
        promiseNetwork: network,
      }),
      promisorAccount,
    ];
  }

  /**
   * Updates the state of an existing Promisor.
   * @param promisor Promisor to update.
   * @param state New state for the Promisor.
   * @returns Updated Promisor.
   */
  public async updatePromisor(
    promisor: Promisor,
    state: PromisorState
  ): Promise<Promisor> {
    const signature = await this._buildUpdatePromisor(
      promisor.address,
      promisor.network,
      state,
      this.wallet.publicKey
    ).rpc();

    await this.confirmTransaction(signature);
    const updatePromisor = await this.getPromisor(promisor.address);
    if (updatePromisor == null)
      throw new Error("Failed to update promisor for unknown reason.");

    return updatePromisor;
  }

  /**
   * Builds an instruction to update the state of an existing Promisor.
   * @param promisor Promisor to update.
   * @param network Network the promisor belongs to.
   * @param state New state for the Promisor.
   * @param owner The owner of the Promisor.
   * @returns An instruction that updates the Promisor.
   */
  public async buildUpdatePromisor(
    promisor: PublicKey,
    network: PublicKey,
    state: PromisorState,
    owner: PublicKey
  ): Promise<TransactionInstruction> {
    return await this._buildUpdatePromisor(
      promisor,
      network,
      state,
      owner
    ).instruction();
  }

  private _buildUpdatePromisor(
    promisor: PublicKey,
    network: PublicKey,
    state: PromisorState,
    owner: PublicKey
  ): PromiseMethods {
    return this.program.methods
      .updatePromisor(fromPromisorState(state))
      .accounts({
        promisor: promisor,
        owner: owner,
        promiseNetwork: network,
        authority: owner,
      });
  }

  /**
   * ======================================================
   * PROMISES
   * =========================
   */

  /**
   * Gets the public key and bump of a Promise based on Network, Promisor and unique id.
   * @param network Address of Network.
   * @param promisor Address of the Promisor.
   * @param id Unique number for the promise (Promisor.numberOfPromises + 1)
   * @returns Public key and bump of the Promise.
   */
  public getPromisePDA(
    network: PublicKey,
    promisor: PublicKey,
    id: number
  ): [PublicKey, number] {
    const seeds = createPromiseSeeds(network, promisor, id);
    return PublicKey.findProgramAddressSync(seeds, this.getProgramId());
  }

  /**
   * Gets the specified Promise using the public address.
   * @param pubKey Public key of the Promise account.
   * @returns Promise if it exists.
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
      createdAt: new Date(promise.createdAt.toNumber() * 1000),
      updatedAt: new Date(promise.updatedAt.toNumber() * 1000),
      numberOfPromisees: promise.numPromisees,
    };
  }

  /**
   * Gets all Promises that are available on the program.
   * @param filter Filter to narrow down the list of Promises.
   * @returns Array of Promises.
   */
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
        createdAt: new Date(promise.account.createdAt.toNumber() * 1000),
        updatedAt: new Date(promise.account.updatedAt.toNumber() * 1000),
        numberOfPromisees: promise.account.numPromisees,
      };
    });
  }

  /**
   * Creates a Promise for the Promisor.
   * @param promisor Promisor that owns the Promise.
   * @param promisorRuleset Ruleset for the Promisor.
   * @param promiseeRuleset Ruleset for the Promisee.
   * @returns Newly created Promise.
   */
  public async createPromise(
    promisor: Promisor,
    promisorRuleset: PromisorRuleset,
    promiseeRuleset: PromiseeRuleset,
    uri?: string
  ): Promise<PromiseProtocol> {
    const [method, promiseAccount] = this._buildCreatePromise(
      promisor.address,
      promisor.network,
      promisor.numberOfPromises + 1,
      promisorRuleset,
      promiseeRuleset,
      this.wallet.publicKey,
      uri
    );

    const signature = await method.rpc();
    await this.confirmTransaction(signature);
    const promise = await this.getPromise(promiseAccount);
    if (promise == null)
      throw new Error("Failed to create promise for unknown reason.");

    return promise;
  }

  /**
   * Builds an instruction that creates a Promise for the Promisor.
   * @param promisor Promisor that owns the Promise.
   * @param network Network that the Promisor is on.
   * @param id Unique id of the promise.
   * @param promisorRuleset Ruleset for the Promisor.
   * @param promiseeRuleset Ruleset for the Promisee.
   * @param owner Owner of the Promise/Promisor.
   * @returns An instruction that creates a Promise.
   */
  public async buildCreatePromise(
    promisor: PublicKey,
    network: PublicKey,
    id: number,
    promisorRuleset: PromisorRuleset,
    promiseeRuleset: PromiseeRuleset,
    owner: PublicKey,
    uri?: string
  ): Promise<TransactionInstruction> {
    return await this._buildCreatePromise(
      promisor,
      network,
      id,
      promisorRuleset,
      promiseeRuleset,
      owner,
      uri,
    )[0].instruction();
  }

  private _buildCreatePromise(
    promisor: PublicKey,
    network: PublicKey,
    id: number,
    promisorRuleset: PromisorRuleset,
    promiseeRuleset: PromiseeRuleset,
    owner: PublicKey,
    uri?: string
  ): [PromiseMethods, PublicKey] {
    const promisorData = promisorRuleset.toData();
    const promiseeData = promiseeRuleset.toData();
    const [promiseAccount, promiseBump] = this.getPromisePDA(
      network,
      promisor,
      id
    );

    return [
      this.program.methods
        .initializePromise(id, promisorData, promiseeData, promiseBump, uri ?? null)
        .accounts({
          promise: promiseAccount,
          promisor: promisor,
          promiseNetwork: network,
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

  /**
   * Updates an existing Promise with new rulesets.
   * @param promise Promise to update.
   * @param promisorRuleset New ruleset for the Promisor.
   * @param promiseeRuleset New ruleset for the Promisee.
   * @returns Updated Promise.
   */
  public async updatePromise(
    promise: PromiseProtocol,
    promisorRuleset: PromisorRuleset,
    promiseeRuleset: PromiseeRuleset
  ): Promise<PromiseProtocol> {
    const signature = await this._buildUpdatePromise(
      promise.address,
      promise.promisor,
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

  /**
   * Builds an instruction that updates a promise.
   * @param promise Promise to update.
   * @param promisor Promisor that owns the Promise.
   * @param promisorRuleset New ruleset for the Promisor.
   * @param promiseeRuleset New ruleset for the Promisee.
   * @param owner Owner of the Promise.
   * @returns An instruction that updates a promise.
   */
  public async buildUpdatePromise(
    promise: PublicKey,
    promisor: PublicKey,
    promisorRuleset: PromisorRuleset,
    promiseeRuleset: PromiseeRuleset,
    owner: PublicKey
  ): Promise<TransactionInstruction> {
    return await this._buildUpdatePromise(
      promise,
      promisor,
      promisorRuleset,
      promiseeRuleset,
      owner
    ).instruction();
  }

  private _buildUpdatePromise(
    promise: PublicKey,
    promisor: PublicKey,
    promisorRuleset: PromisorRuleset,
    promiseeRuleset: PromiseeRuleset,
    owner: PublicKey
  ): PromiseMethods {
    const promisorData = promisorRuleset.toData();
    const promiseeData = promiseeRuleset.toData();

    return this.program.methods
      .updatePromiseRules(promisorData, promiseeData)
      .accounts({
        promise: promise,
        promisor: promisor,
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

  /**
   * Sets the Promise to active state.
   * @param promise Promise to activate.
   * @returns An updated Promise.
   */
  public async activatePromise(
    promise: PromiseProtocol
  ): Promise<PromiseProtocol> {
    const signature = await this._buildActivatePromise(
      promise.address,
      promise.promisor,
      this.wallet.publicKey
    ).rpc();

    await this.confirmTransaction(signature);
    const activatedPromise = await this.getPromise(promise.address);
    if (activatedPromise == null)
      throw new Error("Failed to activate promise for unknown reason.");

    return activatedPromise;
  }

  /**
   * Builds an instruction that activates a Promise.
   * @param promise Promise to activate.
   * @param promisor Promisor that owns the Promise.
   * @param owner Owner of the Promise.
   * @returns An instruction that activates a Promise.
   */
  public async buildActivatePromise(
    promise: PublicKey,
    promisor: PublicKey,
    owner: PublicKey
  ): Promise<TransactionInstruction> {
    return await this._buildActivatePromise(
      promise,
      promisor,
      owner
    ).instruction();
  }

  private _buildActivatePromise(
    promise: PublicKey,
    promisor: PublicKey,
    owner: PublicKey
  ): PromiseMethods {
    return this.program.methods
      .updatePromiseActive()
      .accounts({
        promise: promise,
        promisor: promisor,
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

  /**
   * Creates and assigns a Promisee to the Promise.
   * @param promise Promise to create the Promisee under.
   * @param creator Optional creator of the Promisee.
   * @returns Promisee for the Promise.
   */
  public async acceptPromise(
    promise: PromiseProtocol,
    creator?: PublicKey
  ): Promise<Promisee> {
    const [method, promiseeAccount] = this._buildAcceptPromise(
      promise.address,
      creator ?? this.wallet.publicKey,
      this.wallet.publicKey
    );

    const signature = await method.rpc();
    await this.confirmTransaction(signature);
    const promisee = await this.getPromisee(promiseeAccount);
    if (promisee == null)
      throw new Error("Failed to accept promise for unknown reason.");

    return promisee;
  }

  /**
   * Builds an instruction that creates and assigns a Promisee to the Promise.
   * @param promise Promise to create the Promisee under.
   * @param creator Optional creator of the Promisee.
   * @param owner Owner of the Promisee.
   * @returns An instruction that creates a Promisee.
   */
  public async buildAcceptPromise(
    promise: PublicKey,
    creator: PublicKey,
    owner: PublicKey
  ): Promise<TransactionInstruction> {
    return await this._buildAcceptPromise(
      promise,
      creator,
      owner
    )[0].instruction();
  }

  private _buildAcceptPromise(
    promise: PublicKey,
    creator: PublicKey,
    owner: PublicKey
  ): [PromiseMethods, PublicKey] {
    const [promiseeAccount, promiseeBump] = this.getPromiseePDA(promise, owner);

    return [
      this.program.methods
        .updatePromiseAccept(promiseeBump, creator)
        .accounts({
          promisee: promiseeAccount,
          promiseeOwner: owner,
          promise: promise,
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

  /**
   * Sets a Promise to complete and assigns the Promisee with the reward.
   * @param promise Promise to complete.
   * @param promisee Promisee to transfer the reward.
   * @returns Updated Promise.
   */
  public async completePromise(
    promise: PromiseProtocol,
    promisee: Promisee
  ): Promise<PromiseProtocol> {
    const signature = await this._buildCompletePromise(
      promise.address,
      promise.promisor,
      promisee.address,
      promisee.owner,
      this.wallet.publicKey
    ).rpc();

    await this.confirmTransaction(signature);
    const completedPromise = await this.getPromise(promise.address);
    if (completedPromise == null)
      throw new Error("Failed to complete promise for unknown reason.");

    return completedPromise;
  }

  /**
   * Builds an instruction that sets a Promise to complete and assigns the Promisee with the reward.
   * @param promise Promise to complete.
   * @param promisor Promisor that owns the Promise.
   * @param promisee Promisee that completed the Promise.
   * @param promiseeOwner Owner to transfer the rewards.
   * @param owner Owner of the Promise.
   * @returns An instruction that completes a Promise.
   */
  public async buildCompletePromise(
    promise: PublicKey,
    promisor: PublicKey,
    promisee: PublicKey,
    promiseeOwner: PublicKey,
    owner: PublicKey
  ): Promise<TransactionInstruction> {
    return await this._buildCompletePromise(
      promise,
      promisor,
      promisee,
      promiseeOwner,
      owner
    ).instruction();
  }

  private _buildCompletePromise(
    promise: PublicKey,
    promisor: PublicKey,
    promisee: PublicKey,
    promiseeOwner: PublicKey,
    owner: PublicKey,
    uri?: string,
  ): PromiseMethods {
    return this.program.methods
      .updatePromiseCompleted(uri ?? null)
      .accounts({
        promisee: promisee,
        promisor: promisor,
        promisorOwner: owner,
        promise: promise,
      })
      .remainingAccounts([
        {
          pubkey: promiseeOwner,
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

  /**
   * Gets the public key and bump of a Promisee based on the Promise and owner.
   * @param promise Address of the Promise.
   * @param owner Owner of the Promisee.
   * @returns Public key and bump of the Promisee.
   */
  public getPromiseePDA(
    promise: PublicKey,
    owner: PublicKey
  ): [PublicKey, number] {
    const seeds = createPromiseeSeeds(promise, owner);
    return PublicKey.findProgramAddressSync(seeds, this.getProgramId());
  }

  /**
   * Gets the specified Promisee using the public address.
   * @param pubKey Public key of the Promisee account.
   * @returns Promisee if it exists.
   */
  public async getPromisee(pubKey: PublicKey): Promise<Promisee | undefined> {
    const promisee = await this.program.account.promisee.fetch(pubKey);
    return {
      address: pubKey,
      promise: promisee.promise,
      creator: promisee.creator,
      owner: promisee.owner,
      createdAt: new Date(promisee.createdAt.toNumber() * 1000),
      updatedAt: new Date(promisee.updatedAt.toNumber() * 1000),
      bump: promisee.bump,
    };
  }

  /**
   * Gets all Promisees that are available on the program.
   * @param filter Filter to narrow down the list of Promisees.
   * @returns Array of Promisees.
   */
  public async getPromisees(filter?: PromiseeFilter): Promise<Promisee[]> {
    const filters = fromPromiseeFilter(filter);
    const promisees = await this.program.account.promisee.all(filters);
    return promisees.map((promisee) => {
      return {
        address: promisee.publicKey,
        promise: promisee.account.promise,
        creator: promisee.account.creator,
        owner: promisee.account.owner,
        createdAt: new Date(promisee.account.createdAt.toNumber() * 1000),
        updatedAt: new Date(promisee.account.updatedAt.toNumber() * 1000),
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
      "confirmed"
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

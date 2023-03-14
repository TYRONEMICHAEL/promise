import { Program } from "@project-serum/anchor";
import { MethodsBuilder } from "@project-serum/anchor/dist/cjs/program/namespace/methods";
import { AllInstructions } from "@project-serum/anchor/dist/cjs/program/namespace/types";
import { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import { Cluster, Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { Promise as PromiseAccount } from "../../target/types/promise";
import { Network } from "./network/Network";
import { NetworkRuleset } from "./network/NetworkRuleset";
import { PromiseFilter } from "./promise/PromiseFilter";
import { PromiseProtocol } from "./promise/PromiseProtocol";
import { Promisee } from "./promisee/Promisee";
import { PromiseeFilter } from "./promisee/PromiseeFilter";
import { PromiseeRuleset } from "./promisee/PromiseeRuleset";
import { Promisor } from "./promisor/Promisor";
import { PromisorFilter } from "./promisor/PromisorFilter";
import { PromisorRuleset } from "./promisor/PromisorRuleset";
import { PromisorState } from "./promisor/PromisorState";
export type ExtendedCluster = "localnet" | Cluster;
export declare class PromiseSDK {
    program: Program<PromiseAccount>;
    wallet: Wallet;
    constructor(connection: Connection, wallet: Wallet, programID: PublicKey);
    static localnet(wallet: Wallet): PromiseSDK;
    static devnet(wallet: Wallet): PromiseSDK;
    static testnet(wallet: Wallet): PromiseSDK;
    static mainnet(wallet: Wallet): PromiseSDK;
    static getProgramId(env: ExtendedCluster): PublicKey;
    private static create;
    /**
     * ======================================================
     * GENERAL
     * =========================
     */
    /**
     * Returns the Program ID of the Promise protocol.
     * @returns Public Key of the Promise protocol.
     */
    getProgramId(): PublicKey;
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
    getNetworkPDA(owner: PublicKey): [PublicKey, number];
    /**
     * Gets the specified Network using the public address.
     * @param pubKey Public key of the Network account.
     * @returns Network if it exists.
     */
    getNetwork(pubKey: PublicKey): Promise<Network | undefined>;
    /**
     * Gets all Networks that are available on the program.
     * @returns Array of Networks.
     */
    getNetworks(): Promise<Network[]>;
    /**
     * Initialises a Network on the program.
     * @param ruleset Rules for the Network.
     * @returns Newly created Network.
     */
    createNetwork(ruleset: NetworkRuleset): Promise<Network>;
    /**
     * Builds an instruction that will initialise a Network.
     * @param ruleset Rules for the Network.
     * @param owner Owner that will create the Network and be charged.
     * @returns An instruction that will initialise a Network.
     */
    buildCreateNetwork(ruleset: NetworkRuleset, owner: PublicKey): Promise<TransactionInstruction>;
    private _buildCreateNetwork;
    /**
     * Updates an existing Network with a new ruleset.
     * @param network Network to update.
     * @param ruleset Updated ruleset for the Network.
     * @returns Updated Network.
     */
    updateNetwork(network: Network, ruleset: NetworkRuleset): Promise<Network>;
    /**
     * Builds an instruction to update an existing Network with a new ruleset.
     * @param network Network to update.
     * @param ruleset Updated ruleset for the Network.
     * @param owner The owner of the Network.
     * @returns Instruction that updates the Network.
     */
    buildUpdateNetwork(network: PublicKey, ruleset: NetworkRuleset, owner: PublicKey): Promise<TransactionInstruction>;
    private _buildUpdateNetwork;
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
    getPromisorPDA(network: PublicKey, owner: PublicKey): [PublicKey, number];
    /**
     * Gets the specified Promisor using the public address.
     * @param pubKey Public key of the Promisor account.
     * @returns Promisor if it exists.
     */
    getPromisor(pubKey: PublicKey): Promise<Promisor | undefined>;
    /**
     * Gets all Promisors that are available on the program.
     * @param filter Filter to narrow down the list of Promisors.
     * @returns Array of Promisors.
     */
    getPromisors(filter?: PromisorFilter): Promise<Promisor[]>;
    /**
     * Creates a Promisor on the Network.
     * @param network Network the Promisor will belong to.
     * @returns Newly created Promisor.
     */
    createPromisor(network: Network): Promise<Promisor>;
    /**
     * Builds an instruction that creates a Promisor on a Network.
     * @param network Network the Promisor will belong to.
     * @param owner The owner of the Promisor.
     * @returns An instruction that creates a Promisor.
     */
    buildCreatePromisor(network: PublicKey, owner: PublicKey): Promise<TransactionInstruction>;
    private _buildCreatePromisor;
    /**
     * Updates the state of an existing Promisor.
     * @param promisor Promisor to update.
     * @param state New state for the Promisor.
     * @returns Updated Promisor.
     */
    updatePromisor(promisor: Promisor, state: PromisorState): Promise<Promisor>;
    /**
     * Builds an instruction to update the state of an existing Promisor.
     * @param promisor Promisor to update.
     * @param network Network the promisor belongs to.
     * @param state New state for the Promisor.
     * @param owner The owner of the Promisor.
     * @returns An instruction that updates the Promisor.
     */
    buildUpdatePromisor(promisor: PublicKey, network: PublicKey, state: PromisorState, owner: PublicKey): Promise<TransactionInstruction>;
    private _buildUpdatePromisor;
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
    getPromisePDA(network: PublicKey, promisor: PublicKey, id: number): [PublicKey, number];
    /**
     * Gets the specified Promise using the public address.
     * @param pubKey Public key of the Promise account.
     * @returns Promise if it exists.
     */
    getPromise(pubKey: PublicKey): Promise<PromiseProtocol | undefined>;
    /**
     * Gets all Promises that are available on the program.
     * @param filter Filter to narrow down the list of Promises.
     * @returns Array of Promises.
     */
    getPromises(filter?: PromiseFilter): Promise<PromiseProtocol[]>;
    /**
     * Creates a Promise for the Promisor.
     * @param promisor Promisor that owns the Promise.
     * @param promisorRuleset Ruleset for the Promisor.
     * @param promiseeRuleset Ruleset for the Promisee.
     * @param uri Uri for the Promise.
     * @returns Newly created Promise.
     */
    createPromise(promisor: Promisor, promisorRuleset: PromisorRuleset, promiseeRuleset: PromiseeRuleset, uri?: string): Promise<PromiseProtocol>;
    /**
     * Builds an instruction that creates a Promise for the Promisor.
     * @param promisor Promisor that owns the Promise.
     * @param network Network that the Promisor is on.
     * @param id Unique id of the promise.
     * @param promisorRuleset Ruleset for the Promisor.
     * @param promiseeRuleset Ruleset for the Promisee.
     * @param owner Owner of the Promise/Promisor.
     * @param uri Uri for the Promise.
     * @returns An instruction that creates a Promise.
     */
    buildCreatePromise(promisor: PublicKey, network: PublicKey, id: number, promisorRuleset: PromisorRuleset, promiseeRuleset: PromiseeRuleset, owner: PublicKey, uri?: string): Promise<TransactionInstruction>;
    private _buildCreatePromise;
    /**
     * Updates an existing Promise with new rulesets.
     * @param promise Promise to update.
     * @param promisorRuleset New ruleset for the Promisor.
     * @param promiseeRuleset New ruleset for the Promisee.
     * @returns Updated Promise.
     */
    updatePromise(promise: PromiseProtocol, promisorRuleset: PromisorRuleset, promiseeRuleset: PromiseeRuleset): Promise<PromiseProtocol>;
    /**
     * Builds an instruction that updates a promise.
     * @param promise Promise to update.
     * @param promisor Promisor that owns the Promise.
     * @param promisorRuleset New ruleset for the Promisor.
     * @param promiseeRuleset New ruleset for the Promisee.
     * @param owner Owner of the Promise.
     * @returns An instruction that updates a promise.
     */
    buildUpdatePromise(promise: PublicKey, promisor: PublicKey, promisorRuleset: PromisorRuleset, promiseeRuleset: PromiseeRuleset, owner: PublicKey): Promise<TransactionInstruction>;
    private _buildUpdatePromise;
    /**
     * Sets the Promise to active state.
     * @param promise Promise to activate.
     * @returns An updated Promise.
     */
    activatePromise(promise: PromiseProtocol): Promise<PromiseProtocol>;
    /**
     * Builds an instruction that activates a Promise.
     * @param promise Promise to activate.
     * @param promisor Promisor that owns the Promise.
     * @param owner Owner of the Promise.
     * @returns An instruction that activates a Promise.
     */
    buildActivatePromise(promise: PublicKey, promisor: PublicKey, owner: PublicKey): Promise<TransactionInstruction>;
    private _buildActivatePromise;
    /**
     * Creates and assigns a Promisee to the Promise.
     * @param promise Promise to create the Promisee under.
     * @param creator Optional creator of the Promisee.
     * @returns Promisee for the Promise.
     */
    acceptPromise(promise: PromiseProtocol, creator?: PublicKey): Promise<Promisee>;
    /**
     * Builds an instruction that creates and assigns a Promisee to the Promise.
     * @param promise Promise to create the Promisee under.
     * @param creator Optional creator of the Promisee.
     * @param owner Owner of the Promisee.
     * @returns An instruction that creates a Promisee.
     */
    buildAcceptPromise(promise: PublicKey, creator: PublicKey, owner: PublicKey): Promise<TransactionInstruction>;
    private _buildAcceptPromise;
    /**
     * Sets a Promise to complete and assigns the Promisee with the reward.
     * @param promise Promise to complete.
     * @param promisee Promisee to transfer the reward.
     * @param uri Uri for the Promise.
     * @returns Updated Promise.
     */
    completePromise(promise: PromiseProtocol, promisee: Promisee, uri?: string): Promise<PromiseProtocol>;
    /**
     * Builds an instruction that sets a Promise to complete and assigns the Promisee with the reward.
     * @param promise Promise to complete.
     * @param promisor Promisor that owns the Promise.
     * @param promisee Promisee that completed the Promise.
     * @param promiseeOwner Owner to transfer the rewards.
     * @param owner Owner of the Promise.
     * @param uri Uri for the Promise.
     * @returns An instruction that completes a Promise.
     */
    buildCompletePromise(promise: PublicKey, promisor: PublicKey, promisee: PublicKey, promiseeOwner: PublicKey, owner: PublicKey, uri?: string): Promise<TransactionInstruction>;
    private _buildCompletePromise;
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
    getPromiseePDA(promise: PublicKey, owner: PublicKey): [PublicKey, number];
    /**
     * Gets the specified Promisee using the public address.
     * @param pubKey Public key of the Promisee account.
     * @returns Promisee if it exists.
     */
    getPromisee(pubKey: PublicKey): Promise<Promisee | undefined>;
    /**
     * Gets all Promisees that are available on the program.
     * @param filter Filter to narrow down the list of Promisees.
     * @returns Array of Promisees.
     */
    getPromisees(filter?: PromiseeFilter): Promise<Promisee[]>;
    /**
     * ======================================================
     * PRIVATE
     * =========================
     */
    private confirmTransaction;
}
export type PromiseMethods = MethodsBuilder<PromiseAccount, AllInstructions<PromiseAccount>>;

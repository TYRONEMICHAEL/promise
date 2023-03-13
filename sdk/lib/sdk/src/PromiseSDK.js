"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiseSDK = void 0;
const anchor_1 = require("@project-serum/anchor");
const web3_js_1 = require("@solana/web3.js");
const promise_1 = require("./idl/promise");
const Network_1 = require("./network/Network");
const NetworkRuleset_1 = require("./network/NetworkRuleset");
const PromiseFilter_1 = require("./promise/PromiseFilter");
const PromiseProtocol_1 = require("./promise/PromiseProtocol");
const PromiseState_1 = require("./promise/PromiseState");
const Promisee_1 = require("./promisee/Promisee");
const PromiseeFilter_1 = require("./promisee/PromiseeFilter");
const PromiseeRuleset_1 = require("./promisee/PromiseeRuleset");
const Promisor_1 = require("./promisor/Promisor");
const PromisorFilter_1 = require("./promisor/PromisorFilter");
const PromisorRuleset_1 = require("./promisor/PromisorRuleset");
const PromisorState_1 = require("./promisor/PromisorState");
const programIDs = {
    localnet: "EPwTUQEDoSREqyG9kp4rn2NtxkumDoMGdGnACv6s8J3A",
    devnet: "DB5HAVRLPUYfUcAKK8A57JAihfZvcT3q17wNESfVb4AP",
    testnet: "EPwTUQEDoSREqyG9kp4rn2NtxkumDoMGdGnACv6s8J3A",
    "mainnet-beta": "TODO",
};
class PromiseSDK {
    constructor(connection, wallet, programID) {
        const provider = new anchor_1.AnchorProvider(connection, wallet, anchor_1.AnchorProvider.defaultOptions());
        this.program = new anchor_1.Program(promise_1.IDL, programID, provider);
        this.wallet = wallet;
    }
    static localnet(wallet) {
        return this.create(wallet, "localnet");
    }
    static devnet(wallet) {
        return this.create(wallet, "devnet");
    }
    static testnet(wallet) {
        return this.create(wallet, "testnet");
    }
    static mainnet(wallet) {
        return this.create(wallet, "mainnet-beta");
    }
    static getProgramId(env) {
        return new web3_js_1.PublicKey(programIDs[env]);
    }
    static create(wallet, env) {
        const endpoint = env == "localnet"
            ? "http://127.0.0.1:8899"
            : (0, web3_js_1.clusterApiUrl)(env);
        const connection = new web3_js_1.Connection(endpoint);
        const programID = new web3_js_1.PublicKey(programIDs[env]);
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
    getProgramId() {
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
    getNetworkPDA(owner) {
        const seeds = (0, Network_1.createNetworkSeeds)(owner);
        return web3_js_1.PublicKey.findProgramAddressSync(seeds, this.getProgramId());
    }
    /**
     * Gets the specified Network using the public address.
     * @param pubKey Public key of the Network account.
     * @returns Network if it exists.
     */
    getNetwork(pubKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const network = yield this.program.account.promiseNetwork.fetch(pubKey);
            const ruleset = NetworkRuleset_1.NetworkRuleset.fromData(network.data);
            return {
                address: pubKey,
                createdBy: network.authority,
                ruleset,
            };
        });
    }
    /**
     * Gets all Networks that are available on the program.
     * @returns Array of Networks.
     */
    getNetworks() {
        return __awaiter(this, void 0, void 0, function* () {
            const networks = yield this.program.account.promiseNetwork.all();
            return networks.map((network) => {
                const ruleset = NetworkRuleset_1.NetworkRuleset.fromData(network.account.data);
                return {
                    address: network.publicKey,
                    createdBy: network.account.authority,
                    ruleset,
                    bump: network.account.bump,
                };
            });
        });
    }
    /**
     * Initialises a Network on the program.
     * @param ruleset Rules for the Network.
     * @returns Newly created Network.
     */
    createNetwork(ruleset) {
        return __awaiter(this, void 0, void 0, function* () {
            const [method, networkAccount] = this._buildCreateNetwork(ruleset, this.wallet.publicKey);
            const signature = yield method.rpc();
            yield this.confirmTransaction(signature);
            const network = yield this.getNetwork(networkAccount);
            if (network == null)
                throw new Error("Failed to create network for unknown reason.");
            return network;
        });
    }
    /**
     * Builds an instruction that will initialise a Network.
     * @param ruleset Rules for the Network.
     * @param owner Owner that will create the Network and be charged.
     * @returns An instruction that will initialise a Network.
     */
    buildCreateNetwork(ruleset, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._buildCreateNetwork(ruleset, owner)[0].instruction();
        });
    }
    _buildCreateNetwork(ruleset, owner) {
        const data = ruleset.toData();
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
    updateNetwork(network, ruleset) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = yield this._buildUpdateNetwork(network.address, ruleset, this.wallet.publicKey).rpc();
            yield this.confirmTransaction(signature);
            const updatedNetwork = yield this.getNetwork(network.address);
            if (updatedNetwork == null)
                throw new Error("Failed to update network for unknown reason.");
            return updatedNetwork;
        });
    }
    /**
     * Builds an instruction to update an existing Network with a new ruleset.
     * @param network Network to update.
     * @param ruleset Updated ruleset for the Network.
     * @param owner The owner of the Network.
     * @returns Instruction that updates the Network.
     */
    buildUpdateNetwork(network, ruleset, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._buildUpdateNetwork(network, ruleset, owner).instruction();
        });
    }
    _buildUpdateNetwork(network, ruleset, owner) {
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
    getPromisorPDA(network, owner) {
        const seeds = (0, Promisor_1.createPromisorSeeds)(network, owner);
        return web3_js_1.PublicKey.findProgramAddressSync(seeds, this.getProgramId());
    }
    /**
     * Gets the specified Promisor using the public address.
     * @param pubKey Public key of the Promisor account.
     * @returns Promisor if it exists.
     */
    getPromisor(pubKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const promisor = yield this.program.account.promisor.fetch(pubKey);
            return {
                address: pubKey,
                owner: promisor.owner,
                network: promisor.promiseNetwork,
                state: (0, PromisorState_1.toPromisorState)(promisor.state),
                numberOfPromises: promisor.numPromises,
                updatedAt: new Date(promisor.updatedAt.toNumber() * 1000),
            };
        });
    }
    /**
     * Gets all Promisors that are available on the program.
     * @param filter Filter to narrow down the list of Promisors.
     * @returns Array of Promisors.
     */
    getPromisors(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const filters = (0, PromisorFilter_1.fromPromisorFilter)(filter);
            const promisors = yield this.program.account.promisor.all(filters);
            return promisors.map((promisor) => {
                return {
                    address: promisor.publicKey,
                    owner: promisor.account.owner,
                    network: promisor.account.promiseNetwork,
                    state: (0, PromisorState_1.toPromisorState)(promisor.account.state),
                    numberOfPromises: promisor.account.numPromises,
                    updatedAt: new Date(promisor.account.updatedAt.toNumber() * 1000),
                };
            });
        });
    }
    /**
     * Creates a Promisor on the Network.
     * @param network Network the Promisor will belong to.
     * @returns Newly created Promisor.
     */
    createPromisor(network) {
        return __awaiter(this, void 0, void 0, function* () {
            const [method, promisorAccount] = this._buildCreatePromisor(network.address, this.wallet.publicKey);
            const signature = yield method.rpc();
            yield this.confirmTransaction(signature);
            const promisor = yield this.getPromisor(promisorAccount);
            if (promisor == null)
                throw new Error("Failed to create promisor for unknown reason.");
            return promisor;
        });
    }
    /**
     * Builds an instruction that creates a Promisor on a Network.
     * @param network Network the Promisor will belong to.
     * @param owner The owner of the Promisor.
     * @returns An instruction that creates a Promisor.
     */
    buildCreatePromisor(network, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._buildCreatePromisor(network, owner)[0].instruction();
        });
    }
    _buildCreatePromisor(network, owner) {
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
    updatePromisor(promisor, state) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = yield this._buildUpdatePromisor(promisor.address, promisor.network, state, this.wallet.publicKey).rpc();
            yield this.confirmTransaction(signature);
            const updatePromisor = yield this.getPromisor(promisor.address);
            if (updatePromisor == null)
                throw new Error("Failed to update promisor for unknown reason.");
            return updatePromisor;
        });
    }
    /**
     * Builds an instruction to update the state of an existing Promisor.
     * @param promisor Promisor to update.
     * @param network Network the promisor belongs to.
     * @param state New state for the Promisor.
     * @param owner The owner of the Promisor.
     * @returns An instruction that updates the Promisor.
     */
    buildUpdatePromisor(promisor, network, state, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._buildUpdatePromisor(promisor, network, state, owner).instruction();
        });
    }
    _buildUpdatePromisor(promisor, network, state, owner) {
        return this.program.methods
            .updatePromisor((0, PromisorState_1.fromPromisorState)(state))
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
    getPromisePDA(network, promisor, id) {
        const seeds = (0, PromiseProtocol_1.createPromiseSeeds)(network, promisor, id);
        return web3_js_1.PublicKey.findProgramAddressSync(seeds, this.getProgramId());
    }
    /**
     * Gets the specified Promise using the public address.
     * @param pubKey Public key of the Promise account.
     * @returns Promise if it exists.
     */
    getPromise(pubKey) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const promise = yield this.program.account.promise.fetch(pubKey);
            return {
                id: promise.id,
                address: pubKey,
                network: promise.network,
                promisor: promise.promisor,
                state: (0, PromiseState_1.toPromiseState)(promise.state),
                promiseeRuleset: PromiseeRuleset_1.PromiseeRuleset.fromData(promise.promiseeData),
                promisorRuleset: PromisorRuleset_1.PromisorRuleset.fromData(promise.promisorData),
                createdAt: new Date(promise.createdAt.toNumber() * 1000),
                updatedAt: new Date(promise.updatedAt.toNumber() * 1000),
                numberOfPromisees: promise.numPromisees,
                uri: (_a = promise.uri) !== null && _a !== void 0 ? _a : '',
            };
        });
    }
    /**
     * Gets all Promises that are available on the program.
     * @param filter Filter to narrow down the list of Promises.
     * @returns Array of Promises.
     */
    getPromises(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const filters = (0, PromiseFilter_1.fromPromiseFilter)(filter);
            const promises = yield this.program.account.promise.all(filters);
            return promises.map((promise) => {
                var _a;
                return {
                    id: promise.account.id,
                    address: promise.publicKey,
                    network: promise.account.network,
                    promisor: promise.account.promisor,
                    state: (0, PromiseState_1.toPromiseState)(promise.account.state),
                    promiseeRuleset: PromiseeRuleset_1.PromiseeRuleset.fromData(promise.account.promiseeData),
                    promisorRuleset: PromisorRuleset_1.PromisorRuleset.fromData(promise.account.promisorData),
                    createdAt: new Date(promise.account.createdAt.toNumber() * 1000),
                    updatedAt: new Date(promise.account.updatedAt.toNumber() * 1000),
                    numberOfPromisees: promise.account.numPromisees,
                    uri: (_a = promise.account.uri) !== null && _a !== void 0 ? _a : '',
                };
            });
        });
    }
    /**
     * Creates a Promise for the Promisor.
     * @param promisor Promisor that owns the Promise.
     * @param promisorRuleset Ruleset for the Promisor.
     * @param promiseeRuleset Ruleset for the Promisee.
     * @returns Newly created Promise.
     */
    createPromise(promisor, promisorRuleset, promiseeRuleset, uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const [method, promiseAccount] = this._buildCreatePromise(promisor.address, promisor.network, promisor.numberOfPromises + 1, promisorRuleset, promiseeRuleset, this.wallet.publicKey, uri);
            const signature = yield method.rpc();
            yield this.confirmTransaction(signature);
            const promise = yield this.getPromise(promiseAccount);
            if (promise == null)
                throw new Error("Failed to create promise for unknown reason.");
            return promise;
        });
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
    buildCreatePromise(promisor, network, id, promisorRuleset, promiseeRuleset, owner, uri) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._buildCreatePromise(promisor, network, id, promisorRuleset, promiseeRuleset, owner, uri)[0].instruction();
        });
    }
    _buildCreatePromise(promisor, network, id, promisorRuleset, promiseeRuleset, owner, uri) {
        const promisorData = promisorRuleset.toData();
        const promiseeData = promiseeRuleset.toData();
        const [promiseAccount, promiseBump] = this.getPromisePDA(network, promisor, id);
        return [
            this.program.methods
                .initializePromise(id, promisorData, promiseeData, promiseBump, uri !== null && uri !== void 0 ? uri : null)
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
    updatePromise(promise, promisorRuleset, promiseeRuleset) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = yield this._buildUpdatePromise(promise.address, promise.promisor, promisorRuleset, promiseeRuleset, this.wallet.publicKey).rpc();
            yield this.confirmTransaction(signature);
            const updatedPromise = yield this.getPromise(promise.address);
            if (updatedPromise == null)
                throw new Error("Failed to update promise for unknown reason.");
            return updatedPromise;
        });
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
    buildUpdatePromise(promise, promisor, promisorRuleset, promiseeRuleset, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._buildUpdatePromise(promise, promisor, promisorRuleset, promiseeRuleset, owner).instruction();
        });
    }
    _buildUpdatePromise(promise, promisor, promisorRuleset, promiseeRuleset, owner) {
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
    activatePromise(promise) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = yield this._buildActivatePromise(promise.address, promise.promisor, this.wallet.publicKey).rpc();
            yield this.confirmTransaction(signature);
            const activatedPromise = yield this.getPromise(promise.address);
            if (activatedPromise == null)
                throw new Error("Failed to activate promise for unknown reason.");
            return activatedPromise;
        });
    }
    /**
     * Builds an instruction that activates a Promise.
     * @param promise Promise to activate.
     * @param promisor Promisor that owns the Promise.
     * @param owner Owner of the Promise.
     * @returns An instruction that activates a Promise.
     */
    buildActivatePromise(promise, promisor, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._buildActivatePromise(promise, promisor, owner).instruction();
        });
    }
    _buildActivatePromise(promise, promisor, owner) {
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
                pubkey: web3_js_1.SystemProgram.programId,
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
    acceptPromise(promise, creator) {
        return __awaiter(this, void 0, void 0, function* () {
            const [method, promiseeAccount] = this._buildAcceptPromise(promise.address, creator !== null && creator !== void 0 ? creator : this.wallet.publicKey, this.wallet.publicKey);
            const signature = yield method.rpc();
            yield this.confirmTransaction(signature);
            const promisee = yield this.getPromisee(promiseeAccount);
            if (promisee == null)
                throw new Error("Failed to accept promise for unknown reason.");
            return promisee;
        });
    }
    /**
     * Builds an instruction that creates and assigns a Promisee to the Promise.
     * @param promise Promise to create the Promisee under.
     * @param creator Optional creator of the Promisee.
     * @param owner Owner of the Promisee.
     * @returns An instruction that creates a Promisee.
     */
    buildAcceptPromise(promise, creator, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._buildAcceptPromise(promise, creator, owner)[0].instruction();
        });
    }
    _buildAcceptPromise(promise, creator, owner) {
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
                    pubkey: web3_js_1.SystemProgram.programId,
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
    completePromise(promise, promisee) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = yield this._buildCompletePromise(promise.address, promise.promisor, promisee.address, promisee.owner, this.wallet.publicKey).rpc();
            yield this.confirmTransaction(signature);
            const completedPromise = yield this.getPromise(promise.address);
            if (completedPromise == null)
                throw new Error("Failed to complete promise for unknown reason.");
            return completedPromise;
        });
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
    buildCompletePromise(promise, promisor, promisee, promiseeOwner, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._buildCompletePromise(promise, promisor, promisee, promiseeOwner, owner).instruction();
        });
    }
    _buildCompletePromise(promise, promisor, promisee, promiseeOwner, owner, uri) {
        return this.program.methods
            .updatePromiseCompleted(uri !== null && uri !== void 0 ? uri : null)
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
                pubkey: web3_js_1.SystemProgram.programId,
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
    getPromiseePDA(promise, owner) {
        const seeds = (0, Promisee_1.createPromiseeSeeds)(promise, owner);
        return web3_js_1.PublicKey.findProgramAddressSync(seeds, this.getProgramId());
    }
    /**
     * Gets the specified Promisee using the public address.
     * @param pubKey Public key of the Promisee account.
     * @returns Promisee if it exists.
     */
    getPromisee(pubKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const promisee = yield this.program.account.promisee.fetch(pubKey);
            return {
                address: pubKey,
                promise: promisee.promise,
                creator: promisee.creator,
                owner: promisee.owner,
                createdAt: new Date(promisee.createdAt.toNumber() * 1000),
                updatedAt: new Date(promisee.updatedAt.toNumber() * 1000),
                bump: promisee.bump,
            };
        });
    }
    /**
     * Gets all Promisees that are available on the program.
     * @param filter Filter to narrow down the list of Promisees.
     * @returns Array of Promisees.
     */
    getPromisees(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const filters = (0, PromiseeFilter_1.fromPromiseeFilter)(filter);
            const promisees = yield this.program.account.promisee.all(filters);
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
        });
    }
    /**
     * ======================================================
     * PRIVATE
     * =========================
     */
    confirmTransaction(signature) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = this.program.provider.connection;
            const latestBlockHash = yield connection.getLatestBlockhash();
            const result = yield connection.confirmTransaction({
                blockhash: latestBlockHash.blockhash,
                lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                signature,
            }, "confirmed");
            if (result.value.err != null) {
                throw result.value.err;
            }
        });
    }
}
exports.PromiseSDK = PromiseSDK;

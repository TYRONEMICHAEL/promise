import fs from "fs";
import { AnchorProvider, Program, Wallet } from "@project-serum/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Promise as PromiseAccount } from "../../target/types/promise";
import { Network, createNetworkSeeds } from "./types/Network";
import { NetworkRuleset } from "./types/NetworkRuleset";
import { Promisor, PromisorState, createPromisorSeeds, fromPromisorState, toPromisorState } from "./types/Promisor";

const idl = require("../../target/idl/promise.json");
const programID = new PublicKey(idl.metadata.address);

export class PromiseSDK {
  program: Program<PromiseAccount>;
  authority: Keypair;

  public constructor(
    connection: Connection,
    wallet: Wallet,
    authority: Keypair
  ) {
    const provider = new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions()
    );
    this.program = new Program(idl, programID, provider);
    this.authority = authority;
  }

  public static forLocal(secretKeyPath: string): PromiseSDK {
    const connection = new Connection("http://127.0.0.1:8899");
    const secretKey = JSON.parse(fs.readFileSync(secretKeyPath).toString());
    const decodedSecretKey = new Uint8Array(secretKey);
    const keyPair = Keypair.fromSecretKey(decodedSecretKey);
    const wallet = new Wallet(keyPair);

    return new PromiseSDK(connection, wallet, keyPair);
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
      bump: network.bump,
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
  public async createNetwork(
    ruleset: NetworkRuleset,
    customAuthority?: Keypair
  ): Promise<Network> {
    const authority: Keypair = customAuthority ?? this.authority;
    const data = ruleset.toData() as Buffer;
    const seeds = createNetworkSeeds(authority.publicKey);
    const [networkAccount, networkBump] = PublicKey.findProgramAddressSync(
      seeds,
      this.getProgramId()
    );
    const signature = await this.program.methods
      .initializeNetwork(data, networkBump)
      .accounts({
        promiseNetwork: networkAccount,
        authority: authority.publicKey,
      })
      .signers([authority])
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
    ruleset: NetworkRuleset,
    customAuthority?: Keypair
  ): Promise<Network> {
    const authority = customAuthority ?? this.authority;
    const data = ruleset.toData() as Buffer;

    const signature = await this.program.methods
      .updateNetwork(data)
      .accounts({
        promiseNetwork: network.address,
        authority: authority.publicKey,
      })
      .signers([authority])
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
      network: promisor.network,
      state: toPromisorState(promisor.state),
      numberOfPromises: promisor.numPromisees,
    };
  }

  public async getPromisors(): Promise<Promisor[]> {
    const promisors = await this.program.account.promisor.all();
    return promisors.map((promisor) => {
      return {
        address: promisor.publicKey,
        owner: promisor.account.owner,
        network: promisor.account.network,
        state: toPromisorState(promisor.account.state),
        numberOfPromises: promisor.account.numPromisees,
      };
    });
  }

  public async createPromisor(
    network: Network,
    customOwner?: Keypair
  ): Promise<Promisor> {
    const owner = customOwner ?? this.authority;
    const seeds = createPromisorSeeds(network.address, owner.publicKey);

    const [promisorAccount, promisorBump] = PublicKey.findProgramAddressSync(
      seeds,
      this.getProgramId()
    );

    const signature = await this.program.methods
      .initializePromisor(promisorBump)
      .accounts({
        promisor: promisorAccount,
        owner: owner.publicKey,
        promiseNetwork: network.address,
      })
      .signers([owner])
      .rpc();

    await this.confirmTransaction(signature);

    const promisor = await this.getPromisor(promisorAccount);

    if (promisor == null)
      throw new Error("Failed to create promisor for unknown reason.");

    return promisor;
  }

  public async updatePromisor(
    promisor: Promisor,
    state: PromisorState,
    customOwner?: Keypair
  ): Promise<Promisor> {
    const owner = customOwner ?? this.authority;

    const signature = await this.program.methods
      .updatePromisor(fromPromisorState(state))
      .accounts({
        promisor: promisor.address,
        owner: owner.publicKey,
        promiseNetwork: promisor.network,
      })
      .signers([owner])
      .rpc();

    await this.confirmTransaction(signature);

    const updatePromisor = await this.getPromisor(promisor.address);
    if (updatePromisor == null)
      throw new Error("Failed to update promisor for unknown reason.");

    return updatePromisor;
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

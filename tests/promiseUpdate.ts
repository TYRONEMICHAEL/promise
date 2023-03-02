// import { serialize } from "borsh";
import { AnchorProvider, BN, getProvider, Program, setProvider, utils, web3, workspace } from "@project-serum/anchor";
import { expect } from "chai";
import { Promise as PromiseAccount } from "../target/types/promise";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { PromiseeRuleset, PromisorRuleset, NetworkRuleset, StartDate, SolWager, SolReward, EndDate } from "./schema";
import { serialize } from "@dao-xyz/borsh";

const LAMPORTS_PER_SOL = 1000000000;

describe("promise", () => {
  setProvider(AnchorProvider.env());
  const program = workspace.Promise as Program<PromiseAccount>;

  it("A promise can be updated", async () => {
    const { connection } = getProvider();
    const networkAuthority = web3.Keypair.generate();
    const promisorOwner = web3.Keypair.generate();
    
    const a1 = await connection.requestAirdrop(
      networkAuthority.publicKey,
      LAMPORTS_PER_SOL
    );

    const a2 = await connection.requestAirdrop(
      promisorOwner.publicKey,
      LAMPORTS_PER_SOL
    );

    const latestBlockHash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: a1,
    });

    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: a2,
    });

    const [networkAccount, networkAccountBump] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("promise_network"),
        networkAuthority.publicKey.toBuffer(), 
      ],
      program.programId
    );

    const networkRuleset = new NetworkRuleset();
    const networkSerialized = serialize(networkRuleset);

    await program.methods
      .initializeNetwork(networkSerialized, networkAccountBump)
      .accounts({
        promiseNetwork: networkAccount,
        authority: networkAuthority.publicKey,
      })
      .signers([networkAuthority])
      .rpc();

    const [promisorAccount, promisorAccountBump] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("promisor"),
        networkAccount.toBuffer(),
        promisorOwner.publicKey.toBuffer(),
      ],
      program.programId
    );

    await program.methods
      .initializePromisor(promisorAccountBump)
      .accounts({
        promisor: promisorAccount,
        owner: promisorOwner.publicKey,
        promiseNetwork: networkAccount,
      })
      .signers([promisorOwner])
      .rpc();

    const promisor = await program.account.promisor.fetch(
      promisorAccount
    );

    const id = promisor.numPromises + 1;

    const [promiseAccount, promiseAccountBump] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("promise"),
        networkAccount.toBuffer(),
        promisorAccount.toBuffer(),
        new BN(id).toArrayLike(Buffer, "le", 4),
      ],
      program.programId
    );
    
    const promiseeRuleset = new PromiseeRuleset();
    const promiseeSerialized = serialize(promiseeRuleset);
    const promisorRuleset = new PromisorRuleset()
    const promisorSerialized = serialize(promisorRuleset);

    await program.methods
      .initializePromise(id, promisorSerialized, promiseeSerialized, promiseAccountBump)
      .accounts({
        promise: promiseAccount,
        promisor: promisorAccount,
        promiseNetwork: networkAccount,
        promisorOwner: promisorOwner.publicKey,
      })
      .remainingAccounts([
        {
          pubkey: promisorOwner.publicKey,
          isWritable: true,
          isSigner: true,
        },
        {
          pubkey: SystemProgram.programId,
          isWritable: false,
          isSigner: false,
        }
      ])
      .signers([promisorOwner])
      .rpc();

    const updatedPromisorRuleset = new PromisorRuleset(
      new SolReward(LAMPORTS_PER_SOL / 2)
    );

    const updatedPromisorSerialized = serialize(updatedPromisorRuleset);

    await program.methods
      .updatePromiseRules(updatedPromisorSerialized, promiseeSerialized)
      .accounts({
        promise: promiseAccount,
        promisor: promisorAccount,
        promisorOwner: promisorOwner.publicKey,
      })
      .remainingAccounts([
        {
          pubkey: promisorOwner.publicKey,
          isWritable: true,
          isSigner: true,
        },
        {
          pubkey: SystemProgram.programId,
          isWritable: false,
          isSigner: false,
        }
      ])
      .signers([promisorOwner])
      .rpc();

    const updatedPromisor = await program.account.promisor.fetch(
      promisorAccount
    );

    const promise = await program.account.promise.fetch(
      promiseAccount
    );
    
    expect(updatedPromisor.numPromises).to.equal(1);
    expect(promise.state["created"]).to.not.be.undefined;
    expect(promise.promiseeData).to.deep.equal(promiseeSerialized);
    expect(promise.promisorData).to.deep.equal(updatedPromisorSerialized);
    expect(promise.createdAt).to.be.not.be.undefined;
    expect(promise.updatedAt).to.be.not.be.undefined;
    expect(promise.network.toBase58()).to.equal(networkAccount.toBase58());
    expect(promise.promisor.toBase58()).to.equal(promisorAccount.toBase58());
    expect(promise.bump).to.equal(promiseAccountBump);
  });

  it("A promise can be set to active and the pre_action rules are run", async () => {
    const { connection } = getProvider();
    const networkAuthority = web3.Keypair.generate();
    const promisorOwner = web3.Keypair.generate();
    
    const a1 = await connection.requestAirdrop(
      networkAuthority.publicKey,
      LAMPORTS_PER_SOL
    );

    const a2 = await connection.requestAirdrop(
      promisorOwner.publicKey,
      LAMPORTS_PER_SOL
    );

    const latestBlockHash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: a1,
    });

    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: a2,
    });

    const [networkAccount, networkAccountBump] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("promise_network"),
        networkAuthority.publicKey.toBuffer(), 
      ],
      program.programId
    );

    const networkRuleset = new NetworkRuleset();
    const networkSerialized = serialize(networkRuleset);

    await program.methods
      .initializeNetwork(networkSerialized, networkAccountBump)
      .accounts({
        promiseNetwork: networkAccount,
        authority: networkAuthority.publicKey,
      })
      .signers([networkAuthority])
      .rpc();

    const [promisorAccount, promisorAccountBump] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("promisor"),
        networkAccount.toBuffer(),
        promisorOwner.publicKey.toBuffer(),
      ],
      program.programId
    );

    await program.methods
      .initializePromisor(promisorAccountBump)
      .accounts({
        promisor: promisorAccount,
        owner: promisorOwner.publicKey,
        promiseNetwork: networkAccount,
      })
      .signers([promisorOwner])
      .rpc();

    const promisor = await program.account.promisor.fetch(
      promisorAccount
    );

    const id = promisor.numPromises + 1;

    const [promiseAccount, promiseAccountBump] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("promise"),
        networkAccount.toBuffer(),
        promisorAccount.toBuffer(),
        new BN(id).toArrayLike(Buffer, "le", 4),
      ],
      program.programId
    );
    
    const promiseeRuleset = new PromiseeRuleset();
    const promiseeSerialized = serialize(promiseeRuleset);
    const promisorRuleset = new PromisorRuleset(
      new SolReward(LAMPORTS_PER_SOL / 2)
    )

    const promisorSerialized = serialize(promisorRuleset);

    await program.methods
      .initializePromise(id, promisorSerialized, promiseeSerialized, promiseAccountBump)
      .accounts({
        promise: promiseAccount,
        promisor: promisorAccount,
        promiseNetwork: networkAccount,
        promisorOwner: promisorOwner.publicKey,
      })
      .remainingAccounts([
        {
          pubkey: promisorOwner.publicKey,
          isWritable: true,
          isSigner: true,
        },
        {
          pubkey: SystemProgram.programId,
          isWritable: false,
          isSigner: false,
        }
      ])
      .signers([promisorOwner])
      .rpc();

    let promisorAccountInfo = await connection.getAccountInfo(promisorOwner.publicKey);

    await program.methods
      .updatePromiseActive()
      .accounts({
        promise: promiseAccount,
        promisor: promisorAccount,
        promisorOwner: promisorOwner.publicKey,
      })
      .remainingAccounts([
        {
          pubkey: promisorOwner.publicKey,
          isWritable: true,
          isSigner: true,
        },
        {
          pubkey: SystemProgram.programId,
          isWritable: false,
          isSigner: false,
        }
      ])
      .signers([promisorOwner])
      .rpc();

    let promiseAccountInfo = await connection.getAccountInfo(promiseAccount);
    let debitedPromisorAccountInfo = await connection.getAccountInfo(promisorOwner.publicKey);

    const promise = await program.account.promise.fetch(
      promiseAccount
    );

    expect(debitedPromisorAccountInfo.lamports).to.be.eq(promisorAccountInfo.lamports - LAMPORTS_PER_SOL / 2);
    expect(promiseAccountInfo.lamports).to.be.greaterThan(LAMPORTS_PER_SOL / 2);
    expect(promise.state["active"]).to.not.be.undefined;
  });

  it("A promise can be accepted by a promisee", async () => {
    const { connection } = getProvider();
    const networkAuthority = web3.Keypair.generate();
    const promisorOwner = web3.Keypair.generate();
    const promiseeOwner = web3.Keypair.generate();

    const a1 = await connection.requestAirdrop(
      networkAuthority.publicKey,
      LAMPORTS_PER_SOL
    );

    const a2 = await connection.requestAirdrop(
      promisorOwner.publicKey,
      LAMPORTS_PER_SOL
    );

    const a3 = await connection.requestAirdrop(
      promiseeOwner.publicKey,
      LAMPORTS_PER_SOL
    );

    const latestBlockHash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: a1,
    });

    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: a2,
    });

    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: a3,
    });

    const [networkAccount, networkAccountBump] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("promise_network"),
        networkAuthority.publicKey.toBuffer(), 
      ],
      program.programId
    );

    const networkRuleset = new NetworkRuleset();
    const networkSerialized = serialize(networkRuleset);

    await program.methods
      .initializeNetwork(networkSerialized, networkAccountBump)
      .accounts({
        promiseNetwork: networkAccount,
        authority: networkAuthority.publicKey,
      })
      .signers([networkAuthority])
      .rpc();

    const [promisorAccount, promisorAccountBump] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("promisor"),
        networkAccount.toBuffer(),
        promisorOwner.publicKey.toBuffer(),
      ],
      program.programId
    );

    await program.methods
      .initializePromisor(promisorAccountBump)
      .accounts({
        promisor: promisorAccount,
        owner: promisorOwner.publicKey,
        promiseNetwork: networkAccount,
      })
      .signers([promisorOwner])
      .rpc();

    const promisor = await program.account.promisor.fetch(
      promisorAccount
    );

    const id = promisor.numPromises + 1;

    const [promiseAccount, promiseAccountBump] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("promise"),
        networkAccount.toBuffer(),
        promisorAccount.toBuffer(),
        new BN(id).toArrayLike(Buffer, "le", 4),
      ],
      program.programId
    );
    
    const promiseeRuleset = new PromiseeRuleset(EndDate.fromDate(new Date(Date.now() + 86400000))); 
    const promiseeSerialized = serialize(promiseeRuleset);
    const promisorRuleset = new PromisorRuleset();
    const promisorSerialized = serialize(promisorRuleset);

    await program.methods
      .initializePromise(id, promisorSerialized, promiseeSerialized, promiseAccountBump)
      .accounts({
        promise: promiseAccount,
        promisor: promisorAccount,
        promiseNetwork: networkAccount,
        promisorOwner: promisorOwner.publicKey,
      })
      .signers([promisorOwner])
      .rpc();

    await program.methods
      .updatePromiseActive()
      .accounts({
        promise: promiseAccount,
        promisor: promisorAccount,
        promisorOwner: promisorOwner.publicKey,
      })
      .signers([promisorOwner])
      .rpc();

    const [promiseeAccount, promiseeAccountBump] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("promisee"),
        promiseAccount.toBuffer(),
        promiseeOwner.publicKey.toBuffer(),
      ],
      program.programId
    );

    await program.methods
      .updatePromiseAccept(promiseeAccountBump)
      .accounts({
        promisee: promiseeAccount,
        promiseeOwner: promiseeOwner.publicKey,
        promise: promiseAccount,
      })
      .signers([promiseeOwner])
      .rpc();
    
    const promisee = await program.account.promisee.fetch(
      promiseeAccount
    );

    const promise = await program.account.promise.fetch(
      promiseAccount
    );

    expect(promisee.owner.toBase58()).to.equal(promiseeOwner.publicKey.toBase58());
    expect(promisee.promise.toBase58()).to.equal(promiseAccount.toBase58());
    expect(promisee.bump).to.equal(promiseeAccountBump);
    expect(promisee.createdAt).to.not.be.undefined;
    expect(promisee.updatedAt).to.not.be.undefined;
    expect(promise.numPromisees).to.equal(1);
  });

  it("A promise cannot be accepted by a promisee if the date has surpassed", async () => {
    const { connection } = getProvider();
    const networkAuthority = web3.Keypair.generate();
    const promisorOwner = web3.Keypair.generate();
    const promiseeOwner = web3.Keypair.generate();

    const a1 = await connection.requestAirdrop(
      networkAuthority.publicKey,
      LAMPORTS_PER_SOL
    );

    const a2 = await connection.requestAirdrop(
      promisorOwner.publicKey,
      LAMPORTS_PER_SOL
    );

    const a3 = await connection.requestAirdrop(
      promiseeOwner.publicKey,
      LAMPORTS_PER_SOL
    );

    const latestBlockHash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: a1,
    });

    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: a2,
    });

    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: a3,
    });

    const [networkAccount, networkAccountBump] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("promise_network"),
        networkAuthority.publicKey.toBuffer(), 
      ],
      program.programId
    );

    const networkRuleset = new NetworkRuleset();
    const networkSerialized = serialize(networkRuleset);

    await program.methods
      .initializeNetwork(networkSerialized, networkAccountBump)
      .accounts({
        promiseNetwork: networkAccount,
        authority: networkAuthority.publicKey,
      })
      .signers([networkAuthority])
      .rpc();

    const [promisorAccount, promisorAccountBump] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("promisor"),
        networkAccount.toBuffer(),
        promisorOwner.publicKey.toBuffer(),
      ],
      program.programId
    );

    await program.methods
      .initializePromisor(promisorAccountBump)
      .accounts({
        promisor: promisorAccount,
        owner: promisorOwner.publicKey,
        promiseNetwork: networkAccount,
      })
      .signers([promisorOwner])
      .rpc();

    const promisor = await program.account.promisor.fetch(
      promisorAccount
    );

    const id = promisor.numPromises + 1;

    const [promiseAccount, promiseAccountBump] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("promise"),
        networkAccount.toBuffer(),
        promisorAccount.toBuffer(),
        new BN(id).toArrayLike(Buffer, "le", 4),
      ],
      program.programId
    );
    
    const promiseeRuleset = new PromiseeRuleset(EndDate.fromDate(new Date(Date.now() - 86400000))); 
    const promiseeSerialized = serialize(promiseeRuleset);
    const promisorRuleset = new PromisorRuleset();
    const promisorSerialized = serialize(promisorRuleset);

    await program.methods
      .initializePromise(id, promisorSerialized, promiseeSerialized, promiseAccountBump)
      .accounts({
        promise: promiseAccount,
        promisor: promisorAccount,
        promiseNetwork: networkAccount,
        promisorOwner: promisorOwner.publicKey,
      })
      .signers([promisorOwner])
      .rpc();

    await program.methods
      .updatePromiseActive()
      .accounts({
        promise: promiseAccount,
        promisor: promisorAccount,
        promisorOwner: promisorOwner.publicKey,
      })
      .signers([promisorOwner])
      .rpc();

    const [promiseeAccount, promiseeAccountBump] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("promisee"),
        promiseAccount.toBuffer(),
        promiseeOwner.publicKey.toBuffer(),
      ],
      program.programId
    );
    
    try {
      await program.methods
      .updatePromiseAccept(promiseeAccountBump)
      .accounts({
        promisee: promiseeAccount,
        promiseeOwner: promiseeOwner.publicKey,
        promise: promiseAccount,
      })
      .signers([promiseeOwner])
      .rpc();
    } catch (err) {
      expect(err.message).to.contain("Promisee cannot accept. Ruleset does not allow it.");
    }
  });

  it("A promise can be completed by a promisor", async () => {
    const { connection } = getProvider();
    const networkAuthority = web3.Keypair.generate();
    const promisorOwner = web3.Keypair.generate();
    const promiseeOwner = web3.Keypair.generate();

    const a1 = await connection.requestAirdrop(
      networkAuthority.publicKey,
      LAMPORTS_PER_SOL
    );

    const a2 = await connection.requestAirdrop(
      promisorOwner.publicKey,
      LAMPORTS_PER_SOL
    );

    const a3 = await connection.requestAirdrop(
      promiseeOwner.publicKey,
      LAMPORTS_PER_SOL
    );

    const latestBlockHash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: a1,
    });

    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: a2,
    });

    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: a3,
    });

    const [networkAccount, networkAccountBump] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("promise_network"),
        networkAuthority.publicKey.toBuffer(), 
      ],
      program.programId
    );

    const networkRuleset = new NetworkRuleset();
    const networkSerialized = serialize(networkRuleset);

    await program.methods
      .initializeNetwork(networkSerialized, networkAccountBump)
      .accounts({
        promiseNetwork: networkAccount,
        authority: networkAuthority.publicKey,
      })
      .signers([networkAuthority])
      .rpc();

    const [promisorAccount, promisorAccountBump] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("promisor"),
        networkAccount.toBuffer(),
        promisorOwner.publicKey.toBuffer(),
      ],
      program.programId
    );

    await program.methods
      .initializePromisor(promisorAccountBump)
      .accounts({
        promisor: promisorAccount,
        owner: promisorOwner.publicKey,
        promiseNetwork: networkAccount,
      })
      .signers([promisorOwner])
      .rpc();

    const promisor = await program.account.promisor.fetch(
      promisorAccount
    );

    const id = promisor.numPromises + 1;

    const [promiseAccount, promiseAccountBump] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("promise"),
        networkAccount.toBuffer(),
        promisorAccount.toBuffer(),
        new BN(id).toArrayLike(Buffer, "le", 4),
      ],
      program.programId
    );
    
    const promiseeRuleset = new PromiseeRuleset(EndDate.fromDate(new Date(Date.now() + 86400000))); 
    const promiseeSerialized = serialize(promiseeRuleset);
    const promisorRuleset = new PromisorRuleset(
      new SolReward(LAMPORTS_PER_SOL / 2)
    )
    const promisorSerialized = serialize(promisorRuleset);

    await program.methods
      .initializePromise(id, promisorSerialized, promiseeSerialized, promiseAccountBump)
      .accounts({
        promise: promiseAccount,
        promisor: promisorAccount,
        promiseNetwork: networkAccount,
        promisorOwner: promisorOwner.publicKey,
      })
      .remainingAccounts([
        {
          pubkey: promisorOwner.publicKey,
          isWritable: true,
          isSigner: true,
        },
        {
          pubkey: SystemProgram.programId,
          isWritable: false,
          isSigner: false,
        }
      ])
      .signers([promisorOwner])
      .rpc();

    await program.methods
      .updatePromiseActive()
      .accounts({
        promise: promiseAccount,
        promisor: promisorAccount,
        promisorOwner: promisorOwner.publicKey,
      })
      .remainingAccounts([
        {
          pubkey: promisorOwner.publicKey,
          isWritable: true,
          isSigner: true,
        },
        {
          pubkey: SystemProgram.programId,
          isWritable: false,
          isSigner: false,
        }
      ])
      .signers([promisorOwner])
      .rpc();

    const [promiseeAccount, promiseeAccountBump] = await PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("promisee"),
        promiseAccount.toBuffer(),
        promiseeOwner.publicKey.toBuffer(),
      ],
      program.programId
    );

    await program.methods
      .updatePromiseAccept(promiseeAccountBump)
      .accounts({
        promisee: promiseeAccount,
        promiseeOwner: promiseeOwner.publicKey,
        promise: promiseAccount,
      })
      .signers([promiseeOwner])
      .rpc();

    let promiseeAccountInfoBefore = await connection.getAccountInfo(promiseeOwner.publicKey);
    
     await program.methods
      .updatePromiseCompleted()
      .accounts({
        promisee: promiseeAccount,
        promisor: promisorAccount,
        promisorOwner: promisorOwner.publicKey,
        promise: promiseAccount,
      })
      .remainingAccounts([
        {
          pubkey: promiseeOwner.publicKey,
          isWritable: true,
          isSigner: false,
        }
      ])
      .signers([promisorOwner])
      .rpc();
    
    let promiseeAccountInfoAfter = await connection.getAccountInfo(promiseeOwner.publicKey);

    const promise = await program.account.promise.fetch(
      promiseAccount
    );

    expect(promiseeAccountInfoAfter.lamports - promiseeAccountInfoBefore.lamports).to.equal(LAMPORTS_PER_SOL / 2);
    expect(promise.state["completed"]).to.not.be.undefined;
  });
});

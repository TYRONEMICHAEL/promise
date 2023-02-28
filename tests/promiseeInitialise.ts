// // import { serialize } from "borsh";
// import { AnchorProvider, getProvider, Program, setProvider, utils, web3, workspace } from "@project-serum/anchor";
// import { expect } from "chai";
// import { Promise as PromiseAccount } from "../target/types/promise";
// import { PublicKey } from "@solana/web3.js";
// import { EndDate, NetworkRuleset as Ruleset, StartDate } from "./schema";
// import { serialize } from "@dao-xyz/borsh";

// const LAMPORTS_PER_SOL = 1000000000;

// describe("promise", () => {
//   setProvider(AnchorProvider.env());
//   const program = workspace.Promise as Program<PromiseAccount>;

//   it.only("A promisee can be initialized", async () => {
//     const { connection } = getProvider();
//     const networkAuthority = web3.Keypair.generate();
//     const promiseeOwner = web3.Keypair.generate();
    
//     const a1 = await connection.requestAirdrop(
//       networkAuthority.publicKey,
//       LAMPORTS_PER_SOL
//     );

//     const a2 = await connection.requestAirdrop(
//       promiseeOwner.publicKey,
//       LAMPORTS_PER_SOL
//     );

//     const latestBlockHash = await connection.getLatestBlockhash();

//     await connection.confirmTransaction({
//       blockhash: latestBlockHash.blockhash,
//       lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
//       signature: a1,
//     });

//     await connection.confirmTransaction({
//       blockhash: latestBlockHash.blockhash,
//       lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
//       signature: a2,
//     });

//     const [networkAccount, networkAccountBump] = await PublicKey.findProgramAddress(
//       [
//         utils.bytes.utf8.encode("promise_network"),
//         networkAuthority.publicKey.toBuffer(), 
//       ],
//       program.programId
//     );

//     const ruleset = new Ruleset(
//       StartDate.fromDate(new Date(Date.now() - 86400000)),
//     );

//     const serialized = serialize(ruleset);

//     await program.methods
//       .initializeNetwork(serialized, networkAccountBump)
//       .accounts({
//         promiseNetwork: networkAccount,
//         authority: networkAuthority.publicKey,
//       })
//       .signers([networkAuthority])
//       .rpc();

//     const [promiseeAccount, promiseeAccountBump] = await PublicKey.findProgramAddress(
//       [
//         utils.bytes.utf8.encode("promisee"),
//         networkAccount.toBuffer(),
//         promiseeOwner.publicKey.toBuffer(),
//       ],
//       program.programId
//     );

//     await program.methods
//       .updatePromiseAccept(promiseeAccountBump)
//       .accounts({
//         promisee: promiseeAccount,
//         promiseeOwner: promiseeOwner.publicKey,
//         promise: promiseeAccount,
//       })
//       .signers([promiseeOwner])
//       .rpc();

//     const promisee = await program.account.promisee.fetch(
//       promiseeAccount
//     );

//     expect(promisee.owner.toBase58()).to.equal(promiseeOwner.publicKey.toBase58());
//     expect(promisee.promiseNetwork.toBase58()).to.equal(networkAccount.toBase58());
//     expect(promisee.bump).to.equal(promiseeAccountBump);
//     expect(promisee.createdAt).to.not.be.undefined;
//     expect(promisee.updatedAt).to.not.be.undefined;
//   });
// });

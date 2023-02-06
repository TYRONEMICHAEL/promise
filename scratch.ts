
// // type PublicKey = string;

// enum Frequency {
//     daily,
//     weekly,
//     monthly
// }

// enum PromiseState {
//     awaiting,
//     accepted,
//     declined,
//     failed,
//     succeeded
// }

// enum ReportState {
//     awaitingReview,
//     success,
//     fail
// }

// type ValidatorFee = {
//     validator_fee_token_account: PublicKey;
//     validator_fee_amount: number;
// }

// type UserStake = {
//     user_stake_token_account: PublicKey;
//     user_stake_amount: number;
// }

// type Reward = {
//     reward_token_account: PublicKey;
//     reward_amount: number;
// }

// type PromiseAccount = {
//     user_account?: PublicKey; // User who will be fulfilling the promise
//     validator_account: PublicKey; // Dao, Squad, or User responsible for validating the promise
//     user_stake?: UserStake; // What the user will stake in order to accept the contract
//     validator_fee?: ValidatorFee; // How much the validator will receieve for validating the contract
//     user_reward?: Reward; // What the user will be rewarded with for fulfilling the contract
//     on_failure_stake_receiving_account: PublicKey; // Where the users stake will be transferred to if they fail to fulfilling the contract
//     on_success_reward_receiving_account: PublicKey; // Where the reward will be transferred if the user fulfills the contract
//     promise_name?: string; //. The name of the contract
//     promise_description?: string; // The description of the contract
//     promise_uri?: string; // URI to the external JSON representing additional info
//     promise_created_date: Date; // When the promise was accepted
//     promise_start_date?: Date; // When the promise was accepted
//     promise_end_date: Date; // The promise deadline
//     promise_tags?: string[]; // Self explanatory
//     reporting_frequency: Frequency; // How often the user needs to report
//     promise_state: PromiseState; // The state of the promise
// }

// type ReportAccount = {
//     promise_account: PublicKey;
//     user_report_uri: string; // URI to the external JSON representing additional info
//     validator_feedback_uri: string; // URI to the external JSON representing additional info
//     report_date: Date;
// }

// type Supporter = {
//     supporter_account: PromiseState; // Supporters PublicKey
//     supporter_message: string; // A message a user can relay to the person commited to the promise
//     supporter_user_reward_token_account: PublicKey; // A reward for doing the work outside of the validator
// }


// // const airdropPromise = await connection.requestAirdrop(
// //     promiseAccount.publicKey,
// //     LAMPORTS_PER_SOL
// //   );

// //   const newTx = new Transaction();
// //   newTx.add(createTransferInstruction(
// //       promiseAccount.publicKey,
// //       validatorAccount.publicKey,
// //       new PublicKey("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"),
// //       LAMPORTS_PER_SOL
// //   ))

// //   const instructions: TransactionInstruction[] = [
// //     SystemProgram.transfer({
// //         fromPubkey: promiseAccount.publicKey,
// //         toPubkey: validatorAccount.publicKey,
// //         lamports: 0.01 * LAMPORTS_PER_SOL,
// //     })
// // ];

// // const messageV0 = new TransactionMessage({
// //   payerKey: promiseAccount.publicKey,
// //   recentBlockhash: latestBlockHash.blockhash,
// //   instructions: instructions
// // }).compileToV0Message();

// // const transaction = new VersionedTransaction(messageV0);

// //   transaction.sign([promiseAccount]);

// //   const txid = await connection.sendTransaction(transaction, { maxRetries: 5 });
// //   console.log(txid);
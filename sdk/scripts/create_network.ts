const { clusterApiUrl } = require("@solana/web3.js");

const { Connection, Keypair, LAMPORTS_PER_SOL } = require("@solana/web3.js");
const { PromiseSDK } = require("../lib/sdk/src/PromiseSDK");
const NodeWallet = require("@project-serum/anchor/dist/cjs/nodewallet");
const { NetworkRuleset } = require("../lib/sdk/src/network/NetworkRuleset");

const main = async () => {
  console.log("Creating Network...");
  const authority = Keypair.generate();
  const promise = PromiseSDK.devnet(new NodeWallet.default(authority));

  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
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

  const ruleset = new NetworkRuleset();
  const network = await promise.createNetwork(ruleset);

  console.log("Network Created: ");
  console.log("Address: ", network.address.toBase58());
  console.log("Creator: ", network.createdBy.toBase58());
};

main();

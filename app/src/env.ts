import { env } from "process";

export const solanaWalletCluster = env.SOLANA_WALLET_CLUSTER;
export const solanaWalletEndpoint = 'http://127.0.0.1:8899';

export const promiseNetworkAddress = env.PROMISE_NETWORK_ADDRESS;
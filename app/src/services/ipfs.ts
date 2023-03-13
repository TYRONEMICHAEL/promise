import pinataSDK from '@pinata/sdk'
import { pinataApiKey, pinataSecretApiKey } from '../env';
import { MatchMetadata } from '../interfaces/matches';

const pinata = new pinataSDK({ pinataApiKey, pinataSecretApiKey });

export const pinMatchMetadata = async (match: MatchMetadata) => {
  const { IpfsHash: hash } = await pinata.pinJSONToIPFS(match);
  return [hash, `https://gateway.pinata.cloud/ipfs/${hash}`];
};

export const retrieveMatchMetadata = async (hash: string) => {
  const res = await fetch(`https://gateway.pinata.cloud/ipfs/${hash}`);
  return await (res.json() as Promise<MatchMetadata>);
};

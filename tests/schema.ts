import { field, fixedArray, option, vec } from "@dao-xyz/borsh";
import { PublicKey } from "@solana/web3.js";

export class StartDate {
  @field({type: 'u64'})
  date: number
  
  constructor(date: number) {
    this.date = date;
  }

  public static fromDate(date: Date): StartDate {
    return new StartDate(Math.floor(date.getTime() / 1000));
  }
}

export class EndDate {
  @field({type: 'u64'})
  date: number
  
  constructor(date: number) {
    this.date = date;
  }

  public static fromDate(date: Date): EndDate {
    return new EndDate(Math.floor(date.getTime() / 1000));
  }
}

export class NftGate {
  @field({type: fixedArray('u8', 32) })
  requiredCollection: Uint8Array
  
  constructor(requiredCollection: Uint8Array) {
    this.requiredCollection = requiredCollection;
  }

  public static fromPublicKey(publicKey: PublicKey): NftGate {
    return new NftGate(publicKey.toBytes());
  }
} 

export class NetworkRuleset {
  @field({ type: option(StartDate) })
  startDate: StartDate;
  
  @field({ type: option(EndDate) })
  endDate: EndDate;

  @field({ type: option(NftGate) })
  nftGate: NftGate;

  public constructor(startDate?: StartDate, endDate?: EndDate, nftGate?: NftGate) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.nftGate = nftGate;
  }
};

export class SolWager {
  @field({type: 'u64'})
  amount: number
  
  constructor(amount: number) {
    this.amount = amount;
  }
}

export class PromiseeRuleset {
  @field({ type: option(SolWager) })
  solWager: SolWager;
}

export class SolReward {
  @field({type: 'u64'})
  lamports: number
  
  constructor(lamports: number) {
    this.lamports = lamports;
  }
}

export class PromisorRuleset {
  @field({ type: option(SolReward) })
  solReward: SolReward;

  public constructor(solReward?: SolReward) {
    this.solReward = solReward;
  }
}

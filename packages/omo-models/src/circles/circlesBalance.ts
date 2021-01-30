import BN from "bn.js";

export interface CirclesBalance
{
  lastBlockNo: number,
  tokenAddress: string,
  balance: BN
}

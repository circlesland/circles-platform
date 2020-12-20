import {BN} from "ethereumjs-util";

export interface CirclesBalance
{
  lastBlockNo: number,
  tokenAddress: string,
  balance: BN
}

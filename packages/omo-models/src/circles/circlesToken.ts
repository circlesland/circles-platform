import BN from "bn.js";

export interface CirclesToken
{
    createdInBlockNo: number;
    tokenAddress: string;
    tokenOwner: string;
    balance?: BN;
    noTransactionsUntilBlockNo: number;
}

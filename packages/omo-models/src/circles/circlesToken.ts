import BN from "bn.js";

export interface CirclesToken
{
    balance?: BN;
    noTransactionsUntilBlockNo: number;
    readonly createdInBlockNo: number;
    readonly tokenAddress: string;
    readonly tokenOwner: string;
}

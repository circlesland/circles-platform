import {Address} from "../interfaces/address";
import {BN} from "ethereumjs-util";

export interface CirclesToken
{
  createdInBlockNo: number;
  tokenAddress: Address;
  tokenOwner: Address;
  balance?: BN;
}

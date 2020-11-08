import type Web3 from "web3";
import type {Address} from "../interfaces/address";
import {Erc20Token} from "../token/erc20Token";
import {BN} from "ethereumjs-util";
import {ZERO_ADDRESS} from "../consts";
import {GnosisSafeOps} from "../interfaces/gnosisSafeOps";
import type {Account} from "../interfaces/account";
import type {GnosisSafeProxy} from "../safe/gnosisSafeProxy";

export class CirclesToken extends Erc20Token {
  constructor(web3:Web3, address: Address)
  {
    super(web3, address);
  }

  async getUBI(account: Account, safeProxy: GnosisSafeProxy)
  {
    const txData = this.contract.methods.update().encodeABI();

    return await safeProxy.execTransaction(
      account,
      {
        to: this.address,
        data: txData,
        value: new BN("0"),
        refundReceiver: ZERO_ADDRESS,
        gasToken: ZERO_ADDRESS,
        operation: GnosisSafeOps.CALL
      });
  }
}

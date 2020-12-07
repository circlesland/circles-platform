import type Web3 from "web3";
import type { AbiItem } from "web3-utils";
import { CIRCLES_HUB_ABI, ZERO_ADDRESS } from "../consts";
import type { GnosisSafeProxy } from "../safe/gnosisSafeProxy";
import { BN } from "ethereumjs-util";
import { Web3Contract } from "../web3Contract";
import type { Address } from "../interfaces/address";
import { GnosisSafeOps } from "../interfaces/gnosisSafeOps";
import { config } from "../config";
import { ByteString } from "../interfaces/byteString";

export class CirclesHub extends Web3Contract {
  constructor(web3: Web3, hubAddress: Address) {
    super(web3, hubAddress, new web3.eth.Contract(<AbiItem[]>CIRCLES_HUB_ABI, hubAddress));
  }

  static queryPastSignup(user: Address) {
    return {
      event: CirclesHub.SignupEvent,
      filter: {
        user: user
      },
      fromBlock: config.getCurrent().HUB_BLOCK,
      toBlock: "latest"
    };
  }

  static queryPastSignups(ofUsers: Address[]) {
    return {
      event: CirclesHub.SignupEvent,
      filter: {
        user: ofUsers
      },
      fromBlock: config.getCurrent().HUB_BLOCK,
      toBlock: "latest"
    };
  }

  static queryPastTransfers(from?: Address, to?: Address) {
    if (!from && !to)
      throw new Error("At least one of the two parameters has to be set to a value.");

    let f: any = {};
    if (from)
      f.from = from;
    if (to)
      f.to = to;

    return {
      event: CirclesHub.HubTransferEvent,
      filter: f,
      fromBlock: config.getCurrent().HUB_BLOCK,
      toBlock: "latest"
    };
  }

  static queryPastTrusts(canSendTo?: Address, user?: Address) {
    if (!canSendTo && !user)
      throw new Error("At least one of the two parameters has to be set to a value.");

    let f: any = {};
    if (canSendTo)
      f.canSendTo = canSendTo;
    if (user)
      f.user = user;

    return {
      event: CirclesHub.TrustEvent,
      filter: f,
      fromBlock: config.getCurrent().HUB_BLOCK,
      toBlock: "latest"
    };
  }

  static readonly SignupEvent = "Signup";
  static readonly HubTransferEvent = "HubTransfer";
  static readonly OrganizationSignupEvent = "OrganizationSignup";
  static readonly TrustEvent = "Trust";

  async signup(privateKey: ByteString, safeProxy: GnosisSafeProxy) {
    const txData = this.contract.methods.signup().encodeABI();

    return await safeProxy.execTransaction(
      privateKey,
      {
        to: this.address,
        data: txData,
        value: new BN("0"),
        refundReceiver: ZERO_ADDRESS,
        gasToken: ZERO_ADDRESS,
        operation: GnosisSafeOps.CALL
      });
  }

  async setTrust(privateKey: ByteString, safeProxy: GnosisSafeProxy, to: Address, trustPercentage: BN) {
    const txData = this.contract.methods.trust(to, trustPercentage).encodeABI();

    return await safeProxy.execTransaction(
      privateKey,
      {
        to: this.address,
        data: txData,
        value: new BN("0"),
        refundReceiver: ZERO_ADDRESS,
        gasToken: ZERO_ADDRESS,
        operation: GnosisSafeOps.CALL
      });
  }

  async transferTrough(
    privateKey: ByteString,
    safeProxy: GnosisSafeProxy,
    tokenOwners: Address[],
    sources: Address[],
    destinations: Address[],
    values: BN[]) {
    const transfer = {
      tokenOwners: tokenOwners,
      sources: sources,
      destinations: destinations,
      values: values,
    };

    // TODO: Check the send limit for each edge with the hub contract
    /*
    const sendLimit = await this.contract.methods
      .checkSendLimit(safeProxy.address, safeProxy.address, to)
      .call();

    if (new BN(sendLimit).lt(amount))
      throw new Error("You cannot transfer " + amount.toString() + "units to " + to + " because the recipient doesn't trust your tokens.");
    */

    const txData = await this.contract.methods.transferThrough(
      transfer.tokenOwners,
      transfer.sources,
      transfer.destinations,
      transfer.values,
    )
      .encodeABI();

    console.log("transferTroughAbi:", txData);

    return await safeProxy.execTransaction(
      privateKey,
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

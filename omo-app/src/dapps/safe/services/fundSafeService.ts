import { BN } from "ethereumjs-util";
import {Web3Contract} from "../../../libs/o-circles-protocol/web3Contract";
import {FundSafeContext} from "../processes/omo/fundSafe";
import {tryGetDappState} from "../../../libs/o-os/loader";
import {FissionAuthState} from "../../fissionauth/manifest";
import {OmoSafeState} from "../manifest";

export const fundSafeService = async (context: FundSafeContext) =>
{
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");

  const myAccount = await context.environment.eth.web3.eth.accounts.privateKeyToAccount(
    safeState.myKey.privateKey
  );

  const nonce = await context.environment.eth.web3.eth.getTransactionCount(myAccount.address);
  const value = new BN(context.environment.eth.web3.utils.toWei("0.01", "ether"));

  const gasPrice = new BN(await context.environment.eth.web3.eth.getGasPrice());
  const gasEstimate = new BN(await context.environment.eth.web3.eth.estimateGas({
    gasPrice: gasPrice,
    value: value,
    to: safeState.mySafeAddress,
    from: myAccount.address,
    data: "0x",
    nonce: nonce
  }));

  console.log("Sending 0.01 xDai to ", safeState.mySafeAddress);
  console.log("GasPrice:", gasPrice.toString());
  console.log("GasEstimate:", gasEstimate.toString());

  const signedRawTransaction = await Web3Contract.signRawTransaction(
    myAccount.address,
    myAccount.privateKey,
    safeState.mySafeAddress,
    "0x",
    gasEstimate,
    value);

  const minedReceipt = await Web3Contract.sendSignedRawTransaction(signedRawTransaction);
  console.log(minedReceipt);
}

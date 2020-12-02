import {InitializeAppContext} from "../initializeApp";
import {BN} from "ethereumjs-util";
import {Web3Contract} from "../../../../../libs/o-circles-protocol/web3Contract";

export const fundSafeService = async (context: InitializeAppContext) =>
{
  if(!context.environment.fission) {
    throw new Error("You're not authenticated.");
  }

  const myAccount = await context.environment.eth.web3.eth.accounts.privateKeyToAccount(
    context.environment.me.myKey.privateKey
  );

  const nonce = await context.environment.eth.web3.eth.getTransactionCount(myAccount.address);
  const value = new BN(context.environment.eth.web3.utils.toWei("0.00020", "ether"));

  const gasPrice = new BN(await context.environment.eth.web3.eth.getGasPrice());
  const gasEstimate = new BN(await context.environment.eth.web3.eth.estimateGas({
    gasPrice: gasPrice,
    value: value,
    to: context.environment.me.mySafe.address,
    from: myAccount.address,
    data: "0x",
    nonce: nonce
  }));

  console.log("Sending 0.01 xDai to ", context.environment.me.mySafe.address);
  console.log("GasPrice:", gasPrice.toString());
  console.log("GasEstimate:", gasEstimate.toString());

  const signedRawTransaction = await Web3Contract.signRawTransaction(
    myAccount.address,
    myAccount.privateKey,
    context.environment.me.mySafe.address,
    "0x",
    gasEstimate,
    value);

  const minedReceipt = await Web3Contract.sendSignedRawTransaction(signedRawTransaction);
  console.log(minedReceipt);
}

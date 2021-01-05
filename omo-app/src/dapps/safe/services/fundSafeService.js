var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BN } from "ethereumjs-util";
import { Web3Contract } from "../../../libs/o-circles-protocol/web3Contract";
import { tryGetDappState } from "../../../libs/o-os/loader";
export const fundSafeService = (context) => __awaiter(void 0, void 0, void 0, function* () {
    const fissionAuthState = tryGetDappState("omo.fission.auth:1");
    if (!fissionAuthState.fission) {
        throw new Error("You're not authenticated.");
    }
    const safeState = tryGetDappState("omo.safe:1");
    const myAccount = yield context.environment.eth.web3.eth.accounts.privateKeyToAccount(safeState.myKey.privateKey);
    const nonce = yield context.environment.eth.web3.eth.getTransactionCount(myAccount.address);
    const value = new BN(context.environment.eth.web3.utils.toWei("0.01", "ether"));
    const gasPrice = new BN(yield context.environment.eth.web3.eth.getGasPrice());
    const gasEstimate = new BN(yield context.environment.eth.web3.eth.estimateGas({
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
    const signedRawTransaction = yield Web3Contract.signRawTransaction(myAccount.address, myAccount.privateKey, safeState.mySafeAddress, "0x", gasEstimate, value);
    const minedReceipt = yield Web3Contract.sendSignedRawTransaction(signedRawTransaction);
    console.log(minedReceipt);
});

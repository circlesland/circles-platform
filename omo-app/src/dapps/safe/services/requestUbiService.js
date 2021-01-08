var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { tryGetDappState } from "../../../libs/o-os/loader";
import { GnosisSafeProxy } from "../../../libs/o-circles-protocol/safe/gnosisSafeProxy";
import { CirclesAccount } from "../../../libs/o-circles-protocol/model/circlesAccount";
import { EndSignal, ProgressSignal } from "../../../libs/o-circles-protocol/interfaces/blockchainEvent";
export const requestUbiService = (context) => __awaiter(void 0, void 0, void 0, function* () {
    const safeState = tryGetDappState("omo.safe:1");
    let currentTransactionsList = safeState.myTransactions.getValue();
    safeState.myTransactions.next({
        signal: new ProgressSignal("requestUbi", "Harvesting time", 0),
        payload: currentTransactionsList.payload
    });
    const web3 = context.environment.eth.web3;
    const ownerAddress = context.environment.eth.web3
        .eth
        .accounts
        .privateKeyToAccount(safeState.myKey.privateKey)
        .address;
    const gnosisSafeProxy = new GnosisSafeProxy(web3, ownerAddress, safeState.mySafeAddress);
    const circlesAccount = new CirclesAccount(safeState.mySafeAddress);
    const result = yield circlesAccount.getUBI(safeState.myKey.privateKey, gnosisSafeProxy);
    currentTransactionsList = safeState.myTransactions.getValue();
    safeState.myTransactions.next({
        signal: new EndSignal("requestUbi"),
        payload: currentTransactionsList.payload
    });
    return result;
});

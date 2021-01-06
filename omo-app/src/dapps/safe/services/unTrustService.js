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
import { tryGetDappState } from "../../../libs/o-os/loader";
import { GnosisSafeProxy } from "../../../libs/o-circles-protocol/safe/gnosisSafeProxy";
export const unTrustService = (context) => __awaiter(void 0, void 0, void 0, function* () {
    const web3 = context.environment.eth.web3;
    const safeState = tryGetDappState("omo.safe:1");
    const ownerAddress = context.environment.eth.web3
        .eth
        .accounts
        .privateKeyToAccount(safeState.myKey.privateKey)
        .address;
    const gnosisSafeProxy = new GnosisSafeProxy(web3, ownerAddress, safeState.mySafeAddress);
    return yield context.environment.eth.contracts.hub.setTrust(safeState.myKey.privateKey, gnosisSafeProxy, context.data.trustReceiver.value, new BN(0));
});

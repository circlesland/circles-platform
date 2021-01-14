var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { setDappState, tryGetDappState } from "../../../libs/o-os/loader";
import { GnosisSafeProxy } from "../../../libs/o-circles-protocol/safe/gnosisSafeProxy";
import { CirclesAccount } from "../../../libs/o-circles-protocol/model/circlesAccount";
import { runWithDrive } from "../../../libs/o-fission/fissionDrive";
export const hubSignupService = (context) => __awaiter(void 0, void 0, void 0, function* () {
    yield runWithDrive((fissionDrive) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const web3 = context.environment.eth.web3;
            const safeState = tryGetDappState("omo.safe:1");
            const ownerAddress = web3
                .eth
                .accounts
                .privateKeyToAccount(safeState.myKey.privateKey)
                .address;
            const gnosisSafeProxy = new GnosisSafeProxy(web3, ownerAddress, safeState.mySafeAddress);
            yield context.environment.eth.contracts.hub.signup(safeState.myKey.privateKey, gnosisSafeProxy);
            const circlesAccount = new CirclesAccount(safeState.mySafeAddress);
            const myToken = yield circlesAccount.tryGetMyToken();
            yield fissionDrive.tokens.addMyToken({
                name: "me",
                tokenAddress: myToken.tokenAddress,
                createdInBlockNo: myToken.createdInBlockNo,
                tokenOwner: myToken.tokenOwner,
                noTransactionsUntilBlockNo: myToken.noTransactionsUntilBlockNo
            });
            setDappState("omo.safe:1", existing => {
                return Object.assign(Object.assign({}, existing), { myToken: myToken });
            });
        }
        catch (e) {
            console.error(e);
            throw e;
        }
    }));
});

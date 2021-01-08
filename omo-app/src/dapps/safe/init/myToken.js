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
import { CirclesAccount } from "../../../libs/o-circles-protocol/model/circlesAccount";
import { CirclesToken } from "../../../libs/o-circles-protocol/model/circlesToken";
import { BN } from "ethereumjs-util";
import { ProgressSignal } from "../../../libs/o-circles-protocol/interfaces/blockchainEvent";
import { runWithDrive } from "../../../libs/o-fission/initFission";
export function initMyToken() {
    return __awaiter(this, void 0, void 0, function* () {
        yield runWithDrive((fissionDrive) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const safeState = tryGetDappState("omo.safe:1");
            let myToken;
            try {
                myToken = yield fissionDrive.tokens.tryGetMyToken();
            }
            catch (e) {
                window.o.publishEvent(new ProgressSignal("omo.safe:1:initialize", "Loading your token (from the blockchain) ..", 0));
            }
            if (!myToken) {
                window.o.logger.log("Couldn't find myToken. Querying from blockchain events ..");
                const mySignup = yield new CirclesAccount(safeState.mySafeAddress).tryGetMyToken();
                if (mySignup) {
                    myToken = {
                        name: "me",
                        tokenAddress: mySignup.tokenAddress,
                        tokenOwner: mySignup.tokenOwner,
                        createdInBlockNo: mySignup.createdInBlockNo,
                        noTransactionsUntilBlockNo: mySignup.noTransactionsUntilBlockNo
                    };
                    try {
                        yield fissionDrive.tokens.addMyToken(myToken);
                    }
                    catch (e) {
                        window.o.logger.log((_a = e.message) !== null && _a !== void 0 ? _a : "no message - see args for details", e);
                    }
                }
            }
            setDappState("omo.safe:1", currentState => {
                if (!myToken)
                    return currentState;
                const t = new CirclesToken(safeState.mySafeAddress);
                t.tokenOwner = myToken.tokenOwner;
                t.tokenAddress = myToken.tokenAddress;
                t.balance = new BN("0");
                t.createdInBlockNo = myToken.createdInBlockNo;
                t.noTransactionsUntilBlockNo = myToken.noTransactionsUntilBlockNo;
                return Object.assign(Object.assign({}, currentState), { myToken: t });
            });
        }));
    });
}

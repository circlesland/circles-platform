var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { config } from "../../../libs/o-circles-protocol/config";
import { setDappState, tryGetDappState } from "../../../libs/o-os/loader";
import { CirclesAccount } from "../../../libs/o-circles-protocol/model/circlesAccount";
export function initXDaiBalances() {
    return __awaiter(this, void 0, void 0, function* () {
        const web3 = config.getCurrent().web3();
        const safeState = tryGetDappState("omo.safe:1");
        const ownerAddress = safeState.myKey ? web3
            .eth
            .accounts
            .privateKeyToAccount(safeState.myKey.privateKey)
            .address
            : undefined;
        const balances = yield new CirclesAccount(safeState.mySafeAddress)
            .tryGetXDaiBalance(ownerAddress);
        setDappState("omo.safe:1", (current) => {
            return Object.assign(Object.assign({}, current), balances);
        });
    });
}

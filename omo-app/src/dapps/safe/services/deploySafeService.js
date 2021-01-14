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
import { setDappState, tryGetDappState } from "../../../libs/o-os/loader";
import { runWithDrive } from "../../../libs/o-fission/fissionDrive";
export const deploySafeService = (context) => __awaiter(void 0, void 0, void 0, function* () {
    const omosapienState = tryGetDappState("omo.sapien:1");
    const safeState = tryGetDappState("omo.safe:1");
    const safeProxy = yield context.environment.eth.contracts.safeProxyFactory.deployNewSafeProxy(safeState.myKey.privateKey);
    const ownerAddress = context.environment.eth.web3
        .eth
        .accounts
        .privateKeyToAccount(safeState.myKey.privateKey)
        .address;
    const newAccountXDaiBalance = new BN(yield context.environment.eth.web3.eth.getBalance(ownerAddress));
    setDappState("omo.safe:1", current => {
        return Object.assign(Object.assign({}, current), { mySafeAddress: safeProxy.address, myAccountXDaiBalance: newAccountXDaiBalance });
    });
    const myProfile = Object.assign(Object.assign({}, omosapienState.myProfile), { circlesAddress: safeProxy.address });
    yield runWithDrive((fissionDrive) => __awaiter(void 0, void 0, void 0, function* () {
        yield fissionDrive.profiles.addOrUpdateMyProfile(myProfile);
        setDappState("omo.sapien:1", current => {
            return Object.assign(Object.assign({}, current), { myProfile: myProfile });
        });
    }));
});

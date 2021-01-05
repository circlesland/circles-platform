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
export function initSafeAddress() {
    return __awaiter(this, void 0, void 0, function* () {
        const fissionAuthState = tryGetDappState("omo.fission.auth:1");
        const myProfile = yield fissionAuthState.fission.profiles.tryGetMyProfile();
        if (myProfile === null || myProfile === void 0 ? void 0 : myProfile.circlesAddress) {
            setDappState("omo.safe:1", currentState => {
                return Object.assign(Object.assign({}, currentState), { mySafeAddress: myProfile.circlesAddress });
            });
        }
    });
}

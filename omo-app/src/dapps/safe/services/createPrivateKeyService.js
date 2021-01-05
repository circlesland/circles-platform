var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { entropyToMnemonic } from "bip39";
import { setDappState, tryGetDappState } from "../../../libs/o-os/loader";
export const createPrivateKeyService = (context) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Creating a new account");
    const fissionAuthState = tryGetDappState("omo.fission.auth:1");
    if (!fissionAuthState.fission) {
        throw new Error("You're not authenticated.");
    }
    const web3 = context.environment.eth.web3;
    const newKey = web3.eth.accounts.create();
    yield fissionAuthState.fission.keys.addMyKey({
        name: "me",
        privateKey: newKey.privateKey
    });
    setDappState("omo.safe:1", current => {
        return Object.assign(Object.assign({}, current), { myKey: newKey });
    });
    context.data.privateKey = {
        key: "privateKey",
        type: "string",
        value: newKey.privateKey,
        isReadonly: true
    };
    context.data.privateKeyPhrase = {
        key: "privateKeyPhrase",
        type: "string",
        value: entropyToMnemonic(newKey.privateKey.replace("0x", "")),
        isReadonly: true
    };
});

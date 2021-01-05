var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { entropyToMnemonic, mnemonicToEntropy } from "bip39";
import { config } from "../../../libs/o-circles-protocol/config";
import { tryGetDappState } from "../../../libs/o-os/loader";
function isValidKeyPhrase(value) {
    try {
        const privateKey = mnemonicToEntropy(value);
        const ownerAddress = config
            .getCurrent()
            .web3()
            .eth.accounts.privateKeyToAccount("0x" + privateKey).address;
        const valid = config
            .getCurrent()
            .web3()
            .utils.isAddress(ownerAddress);
        if (valid) {
            return "0x" + privateKey;
        }
        else {
            return null;
        }
    }
    catch (e) {
        console.log("connect safe with private key phrase failed.");
        return null;
    }
}
function isValidHexKey(value) {
    if (!value)
        return null;
    try {
        let hexString;
        if (value.startsWith("0x") && value.length == 66) {
            // prefixed hex string
            hexString = value.slice(2);
        }
        else if (value.length == 64) {
            // non prefixed hex string
            hexString = value;
        }
        const address = config.getCurrent().web3().eth.accounts.privateKeyToAccount("0x" + hexString).address;
        const isValid = config
            .getCurrent()
            .web3()
            .utils.isAddress(address);
        if (isValid)
            return "0x" + hexString;
        else
            return null;
    }
    catch (e) {
        console.log("connect safe with hex private key failed.");
        return null;
    }
}
export const importPrivateKeyService = (context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const fissionAuthState = tryGetDappState("omo.fission.auth:1");
    if (!fissionAuthState.fission) {
        throw new Error("You're not authenticated");
    }
    console.log("Importing an exising account");
    const privateKey = (_a = isValidHexKey(context.data.privateKey.value)) !== null && _a !== void 0 ? _a : isValidKeyPhrase(context.data.privateKey.value);
    const ownerAddress = config.getCurrent().web3()
        .eth
        .accounts
        .privateKeyToAccount(privateKey)
        .address;
    if (!context.environment.eth.web3.utils.isAddress(ownerAddress)) {
        throw new Error("The private key seems to be invalid because no address could be derived from it.");
    }
    yield fissionAuthState.fission.keys.addMyKey({
        name: "me",
        privateKey: privateKey
    });
    context.data.privateKey = {
        key: "privateKey",
        type: "string",
        value: privateKey,
        isReadonly: true
    };
    context.data.privateKeyPhrase = {
        key: "privateKeyPhrase",
        type: "string",
        value: entropyToMnemonic(privateKey.replace("0x", "")),
        isReadonly: true
    };
});

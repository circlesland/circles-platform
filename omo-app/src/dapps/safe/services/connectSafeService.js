var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { mnemonicToEntropy } from "bip39";
import { BN } from "ethereumjs-util";
import { config } from "../../../libs/o-circles-protocol/config";
import { setDappState, tryGetDappState } from "../../../libs/o-os/loader";
import { CirclesAccount } from "../../../libs/o-circles-protocol/model/circlesAccount";
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
export const connectSafeService = (context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const fissionAuthState = tryGetDappState("omo.fission.auth:1");
    if (!fissionAuthState.fission) {
        throw new Error("You're not authenticated");
    }
    const omosapienState = tryGetDappState("omo.sapien:1");
    if (!(omosapienState === null || omosapienState === void 0 ? void 0 : omosapienState.myProfile)) {
        throw new Error("You don't have a profile yet. The safe cannot be linked without a profile.");
    }
    const web3 = config.getCurrent().web3();
    const privateKey = (_a = isValidHexKey(context.data.privateKey.value)) !== null && _a !== void 0 ? _a : isValidKeyPhrase(context.data.privateKey.value);
    const ownerAddress = web3
        .eth
        .accounts
        .privateKeyToAccount(privateKey)
        .address;
    if (!web3.utils.isAddress(ownerAddress)) {
        throw new Error("The private key seems to be invalid because no address could be derived from it.");
    }
    const existingKey = yield fissionAuthState.fission.keys.tryGetMyKey();
    if (existingKey && existingKey.privateKey != privateKey) {
        throw new Error("Trying to overwrite your existing private key. This is not allowed.");
    }
    if (!existingKey) {
        yield fissionAuthState.fission.keys.addMyKey({
            name: "me",
            privateKey: privateKey,
            publicKey: null
        });
    }
    console.log("Linking safe address to profile ..");
    omosapienState.myProfile.circlesAddress = context.data.safeAddress.value;
    yield fissionAuthState.fission.profiles.addOrUpdateMyProfile(omosapienState.myProfile);
    setDappState("omo.sapien", current => {
        return {
            myProfile: omosapienState.myProfile
        };
    });
    setDappState("omo.safe:1", current => {
        return Object.assign(Object.assign({}, current), { myKey: {
                name: "me",
                privateKey: privateKey,
                publicKey: null
            }, mySafeAddress: omosapienState.myProfile.circlesAddress });
    });
    const myAccountXDaiBalance = new BN(yield web3.eth.getBalance(ownerAddress));
    const mySafeXDaiBalance = new BN(omosapienState.myProfile.circlesAddress
        ? (yield web3.eth.getBalance(omosapienState.myProfile.circlesAddress))
        : "0");
    console.log("Find token of safe ..");
    const circlesAccount = new CirclesAccount(omosapienState.myProfile.circlesAddress);
    const myToken = yield circlesAccount.tryGetMyToken();
    yield fissionAuthState.fission.tokens.addMyToken({
        name: "me",
        tokenAddress: myToken.tokenAddress,
        tokenOwner: circlesAccount.safeAddress,
        createdInBlockNo: myToken.createdInBlockNo,
        noTransactionsUntilBlockNo: myToken.noTransactionsUntilBlockNo
    });
    setDappState("omo.safe:1", current => {
        return Object.assign(Object.assign({}, current), { myKey: {
                name: "me",
                privateKey: privateKey,
                publicKey: null
            }, mySafeAddress: omosapienState.myProfile.circlesAddress, myToken: myToken, myAccountXDaiBalance: myAccountXDaiBalance, mySafeXDaiBalance: mySafeXDaiBalance });
    });
});

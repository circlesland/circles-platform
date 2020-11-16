import {ConnectSafeContext} from "../connectSafe";

export const connectSafeService = async (context:ConnectSafeContext) => {
    localStorage.setItem("omo.address", context.connectSafe.safeOwnerAddress.data);
    localStorage.setItem("omo.privateKey", "0x" + context.connectSafe.safeOwnerPrivateKey.data);
    localStorage.setItem("omo.safeAddress", context.connectSafe.safeAddress.data);
}

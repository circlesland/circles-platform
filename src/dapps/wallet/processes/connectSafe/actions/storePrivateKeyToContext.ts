import {assign} from "xstate";
import {config} from "../../../../../libs/o-circles-protocol/config";
import {ConnectSafeContext} from "../connectSafe";
import {mnemonicToEntropy} from "bip39";

export const storePrivateKeyToContext = assign((context:ConnectSafeContext, event: any) => {
    context.connectSafe.safeOwnerPrivateKey = {
      type: "bytestring",
      data: mnemonicToEntropy(event.data.fields[0].value)
    };
    context.connectSafe.safeOwnerAddress = {
        type: "ethereumAddress",
        data: config.getCurrent().web3()
            .eth
            .accounts
            .privateKeyToAccount("0x" + context.connectSafe.safeOwnerPrivateKey.data)
            .address
    };
    return context;
})

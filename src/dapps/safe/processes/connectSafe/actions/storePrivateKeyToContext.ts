import {assign} from "xstate";
import {config} from "../../../../../libs/o-circles-protocol/config";
import {ConnectSafeContext} from "../connectSafe";

export const storePrivateKeyToContext = assign((context:ConnectSafeContext, event: any) => {
    context.connectSafe.safeOwnerPrivateKey = event.data.fields.safeOwnerPrivateKey;
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

import {assign} from "xstate";
import {ConnectSafeContext} from "../connectSafe";

export const storeSafeAddressToContext = assign((context:ConnectSafeContext, event: any) =>
{
    if (!context.connectSafe)
    {
        context.connectSafe = {};
    }
    context.connectSafe.safeAddress = event.data.fields.safeAddress;
    return context;
})

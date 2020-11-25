import {assign} from "xstate";
import {ConnectSafeContext} from "../connectSafe";

export const storeSafeAddressToContext = assign((context:ConnectSafeContext, event: any) =>
{
    if (!context.connectSafe)
    {
        context.connectSafe = {};
    }
    context.connectSafe.safeAddress = {
      type:"ethereumAddress",
      data: event.data.fields[0].value
    };
    return context;
})

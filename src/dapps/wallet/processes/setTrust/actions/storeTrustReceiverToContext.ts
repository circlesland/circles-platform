import {assign} from "xstate";

export const storeTrustReceiverToContext = assign((context: any, event: any) =>
{
    if (!context.setTrust)
    {
        context.setTrust = {};
    }
    context.setTrust.trustReceiver = event.data.fields.trustReceiver;
    return context;
})

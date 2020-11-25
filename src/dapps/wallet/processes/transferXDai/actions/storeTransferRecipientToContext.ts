import {assign} from "xstate";

export const storeTransferRecipientToContext = assign((context: any, event: any) =>
{
    if (!context.transfer)
    {
        context.transfer = {};
    }
    context.transfer.recipient = event.data.fields[0].value;
})

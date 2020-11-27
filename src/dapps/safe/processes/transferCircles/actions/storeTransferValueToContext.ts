import {assign} from "xstate";

export const storeTransferValueToContext = assign((context: any, event: any) => {
    context.transfer.value = event.data.fields.value;
    return context;
})

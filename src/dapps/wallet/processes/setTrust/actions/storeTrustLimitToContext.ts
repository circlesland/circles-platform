import {assign} from "xstate";

export const storeTrustLimitToContext = assign((context: any, event: any) =>
    context.setTrust.trustLimit = event.data.fields.trustLimit)

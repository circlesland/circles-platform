import {ProcessContext} from "../../../../../libs/o-processes/processContext";

export const getUbi = async (context:ProcessContext) => {
    return await context.person.getUBI(context.account, context.safe);
}

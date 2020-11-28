import {ProcessContext} from "../../../../libs/o-processes/interfaces/processContext";

export const getUbi = async (context:ProcessContext) => {
    return await context.environment.person.getUBI(context.environment.account, context.environment.safe);
}

import {TransferXDaiContext} from "../transferXDai";

export const transferXDaiService = async (context:TransferXDaiContext) => {
    return await context.safe.transferEth(context.account, context.transfer.value.data, context.transfer.recipient.data);
}

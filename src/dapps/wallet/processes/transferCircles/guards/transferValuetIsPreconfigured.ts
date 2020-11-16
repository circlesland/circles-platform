import {TransferCirclesContext} from "../transferCircles";

export const transferValueIsPreconfigured = (context:TransferCirclesContext) => context.transfer.value !== undefined;

import {TransferCirclesContext} from "../transferCircles";

export const transferRecipientIsPreconfigured = (context:TransferCirclesContext) => context.transfer?.recipient !== undefined;

import {ProcessContext} from "../../../../libs/o-processes/interfaces/processContext";
import {HubAccount} from "../../../../libs/o-circles-protocol/model/hubAccount";

export const getUbi = async (context:ProcessContext) => {
  const p = new HubAccount(context.environment.eth.contracts.hub, context.environment.me.mySafe.address);
  return await p.getUBI(context.environment.me.myKey.privateKey, context.environment.me.mySafe);
}

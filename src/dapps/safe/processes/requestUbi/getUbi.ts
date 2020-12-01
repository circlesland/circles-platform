import {ProcessContext} from "../../../../libs/o-processes/interfaces/processContext";
import {Person} from "../../../../libs/o-circles-protocol/model/person";

export const getUbi = async (context:ProcessContext) => {
  const p = new Person(context.environment.eth.contracts.hub, context.environment.me.mySafe.address);
  return await p.getUBI(context.environment.me.myKey.privateKey, context.environment.me.mySafe);
}

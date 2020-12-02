import {ConnectSafeContext} from "../connectSafe";
import {HubAccount} from "../../../../../libs/o-circles-protocol/model/hubAccount";
import {ProcessArtifact} from "../../../../../libs/o-processes/interfaces/processArtifact";

export const hubSignupService = async (context: ConnectSafeContext) =>
{
  if(!context.environment.fission) {
    throw new Error("You're not authenticated.");
  }

  await context.environment.eth.contracts.hub.signup(
    context.environment.me.myKey.privateKey,
    context.environment.me.mySafe
  );

  const hubAccount = new HubAccount(context.environment.eth.contracts.hub,
    context.environment.me.mySafe.address);

  context.environment.me.myToken = await hubAccount.getOwnToken();

  await context.environment.me.myData.tokens.addMyToken({
    name: "me",
    tokenAddress: context.environment.me.myToken.address,
    circlesAddress: hubAccount.address
  });

  context.data.tokenAddress = <ProcessArtifact>{
    key: "tokenAddress",
    type: "ethereumAddress",
    value: context.environment.me.myToken.address
  };
}

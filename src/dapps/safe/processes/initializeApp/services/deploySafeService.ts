import {InitializeAppContext} from "../initializeApp";
import {BN} from "ethereumjs-util";

export const deploySafeService = async (context: InitializeAppContext) =>
{
  if(!context.environment.fission) {
    throw new Error("You're not authenticated.");
  }

  const safeProxy = await context.environment.eth.contracts.safeProxyFactory.deployNewSafeProxy(
    context.environment.me.myKey.privateKey
  );

  context.environment.me.mySafe = safeProxy;
  context.environment.me.mySafeXDaiBalance = new BN("0");

  const myProfile = {
    ... context.environment.me.myProfile,
    ... {
      circlesAddress: safeProxy.address
    }
  };

  await context.environment.me.myData.profiles.addOrUpdateMyProfile(myProfile);
}

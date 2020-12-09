import {InitializeAppContext} from "../initializeApp";
import {BN} from "ethereumjs-util";
import {Profile} from "../../../../../libs/o-fission/entities/profile";

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

  const myProfile:Profile = {
    ... context.environment.me.myProfile,
    ... {
      profileType: "circles",
      profileRef: safeProxy.address
    }
  };

  await context.environment.me.myData.profiles.addOrUpdateMyProfile(myProfile);
}

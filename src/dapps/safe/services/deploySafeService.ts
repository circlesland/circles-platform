import { BN } from "ethereumjs-util";
import {DeploySafeContext} from "../processes/safe/deploySafe";
import {setDappState, tryGetDappState} from "../../../libs/o-os/loader";
import {FissionAuthState} from "../../fissionauth/manifest";
import {OmoSafeState} from "../manifest";
import {OmoSapienState} from "../../omosapien/manifest";

export const deploySafeService = async (context: DeploySafeContext) =>
{
  const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  if (!fissionAuthState.fission) {
    throw new Error("You're not authenticated");
  }

  const omosapienState = tryGetDappState<OmoSapienState>("omo.sapien:1");
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");

  const safeProxy = await context.environment.eth.contracts.safeProxyFactory.deployNewSafeProxy(
    safeState.myKey.privateKey
  );

  const ownerAddress = context.environment.eth.web3
    .eth
    .accounts
    .privateKeyToAccount(safeState.myKey.privateKey)
    .address;

  const newAccountXDaiBalance = new BN(
    await context.environment.eth.web3.eth.getBalance(ownerAddress));

  setDappState<OmoSafeState>("omo.safe:1", current => {
    return {
      ...current,
      mySafeAddress: safeProxy.address,
      myAccountXDaiBalance: newAccountXDaiBalance
    }
  });

  const myProfile = {
    ...omosapienState.myProfile,
    circlesAddress: safeProxy.address
  };

  await fissionAuthState.fission.profiles.addOrUpdateMyProfile(myProfile);

  setDappState<OmoSapienState>("omo.sapien:1", current => {
    return {
      ...current,
      myProfile: myProfile
    }
  });
}

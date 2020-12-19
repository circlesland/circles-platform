import {setDappState, tryGetDappState} from "../../../libs/o-os/loader";
import {FissionAuthState} from "../../fissionauth/manifest";
import {OmoSafeState} from "../manifest";

export async function initSafeAddress()
{
  const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  const myProfile = await fissionAuthState.fission.profiles.tryGetMyProfile();

  if (myProfile?.circlesAddress)
  {
    setDappState<OmoSafeState>("omo.safe:1", currentState =>
    {
      return {
        ...currentState,
        mySafeAddress: myProfile.circlesAddress
      };
    });
  }
}

import {setDappState, tryGetDappState} from "../../../libs/o-os/loader";
import {FissionAuthState} from "../../fissionauth/manifest";
import {OmoSafeState} from "../manifest";
import {runWithDrive} from "../../../libs/o-fission/initFission";

export async function initSafeAddress()
{
  await runWithDrive(async fissionDrive =>
  {
    const myProfile = await fissionDrive.profiles.tryGetMyProfile();

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
  });
}

import {OmoSafeState} from "../manifest";
import {runWithDrive} from "omo-fission/dist/fissionDrive";
import {setDappState} from "omo-kernel/dist/kernel";

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

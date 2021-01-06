import {setDappState, tryGetDappState} from "../../../libs/o-os/loader";
import {FissionAuthState} from "../../fissionauth/manifest";
import {OmoSafeState} from "../manifest";
import {runWithDrive} from "../../../libs/o-fission/initFission";

export async function initMyKey()
{
  await runWithDrive(async fissionDrive =>
  {
    const myKey = await fissionDrive.keys.tryGetMyKey();
    setDappState<OmoSafeState>("omo.safe:1", currentState =>
    {
      return {
        ...currentState,
        myKey: myKey
      };
    });
  });
}

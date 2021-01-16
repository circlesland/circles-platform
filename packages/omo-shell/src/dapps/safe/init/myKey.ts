import {setDappState} from "../../../libs/o-os/loader";
import {OmoSafeState} from "../manifest";
import {runWithDrive} from "omo-fission/dist/fissionDrive";

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

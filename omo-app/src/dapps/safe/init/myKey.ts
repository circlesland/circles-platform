import {setDappState, tryGetDappState} from "../../../libs/o-os/loader";
import {FissionAuthState} from "../../fissionauth/manifest";
import {OmoSafeState} from "../manifest";

export async function initMyKey()
{
  const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  const myKey = await fissionAuthState.fission.keys.tryGetMyKey();

  setDappState<OmoSafeState>("omo.safe:1", currentState =>
  {
    return {
      ...currentState,
      myKey: myKey
    };
  });
}

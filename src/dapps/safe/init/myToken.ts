import {setDappState, tryGetDappState} from "../../../libs/o-os/loader";
import {FissionAuthState} from "../../fissionauth/manifest";
import {config} from "../../../libs/o-circles-protocol/config";
import {CirclesHub} from "../../../libs/o-circles-protocol/circles/circlesHub";
import {OmoSafeState} from "../manifest";

export async function initMyToken()
{
  const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
  let myToken = await fissionAuthState.fission.tokens.tryGetMyToken();

  if (!myToken)
  {
    const cfg = config.getCurrent();
    const web3 = config.getCurrent().web3();
    const hub = new CirclesHub(web3, cfg.HUB_ADDRESS);

    const mySignupEvents = hub.queryEvents(CirclesHub.queryPastSignup(safeState.mySafeAddress));
    const mySignupArr = await mySignupEvents.toArray();
    const mySignup = mySignupArr[0];

    if (mySignup)
    {
      myToken = {
        name: "me",
        tokenAddress: mySignup.returnValues.token,
        circlesAddress: mySignup.returnValues.user,
        createdInBlockNo: mySignup.blockNumber.toNumber()
      }
    }
  }

  setDappState<OmoSafeState>("omo.safe:1", currentState =>
  {
    return {
      ...currentState,
      myToken: myToken
    };
  });
}

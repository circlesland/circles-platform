import {setDappState, tryGetDappState} from "../../../libs/o-os/loader";
import {FissionAuthState} from "../../fissionauth/manifest";
import {config} from "../../../libs/o-circles-protocol/config";
import {CirclesHub} from "../../../libs/o-circles-protocol/circles/circlesHub";
import {OmoSafeState} from "../manifest";
import {CirclesAccount} from "../../../libs/o-circles-protocol/queryModel/circlesAccount";

export async function initMyToken()
{
  const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
  let myToken = await fissionAuthState.fission.tokens.tryGetMyToken();

  if (!myToken)
  {
    const mySignup = await new CirclesAccount(safeState.mySafeAddress).tryGetMyToken();
    if (mySignup)
    {
      myToken = {
        name: "me",
        tokenAddress: mySignup.tokenAddress,
        tokenOwner: mySignup.tokenOwner,
        createdInBlockNo: mySignup.createdInBlockNo
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

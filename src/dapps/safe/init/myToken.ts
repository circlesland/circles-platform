import {setDappState, tryGetDappState} from "../../../libs/o-os/loader";
import {FissionAuthState} from "../../fissionauth/manifest";
import {OmoSafeState} from "../manifest";
import {CirclesAccount} from "../../../libs/o-circles-protocol/model/circlesAccount";
import {Token} from "../../../libs/o-fission/entities/token";
import {CirclesToken} from "../../../libs/o-circles-protocol/model/circlesToken";
import {BN} from "ethereumjs-util";

export async function initMyToken()
{
  const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
  let myToken:Token = await fissionAuthState.fission.tokens.tryGetMyToken();

  if (!myToken)
  {
    console.log("Couldn't find myToken. Querying from blockchain events ..");
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
    const t = new CirclesToken(safeState.mySafeAddress);
    t.tokenOwner = myToken.tokenOwner;
    t.tokenAddress = myToken.tokenAddress;
    t.balance = new BN("0");
    t.createdInBlockNo = myToken.createdInBlockNo;

    return {
      ...currentState,
      myToken: t
    };
  });
}

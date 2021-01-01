import {setDappState, tryGetDappState} from "../../../libs/o-os/loader";
import {FissionAuthState} from "../../fissionauth/manifest";
import {OmoSafeState} from "../manifest";
import {CirclesAccount} from "../../../libs/o-circles-protocol/model/circlesAccount";
import {Token} from "../../../libs/o-fission/entities/token";
import {CirclesToken} from "../../../libs/o-circles-protocol/model/circlesToken";
import {BN} from "ethereumjs-util";
import {ProgressSignal} from "../../../libs/o-circles-protocol/interfaces/blockchainEvent";

export async function initMyToken()
{
  const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
  let myToken:Token;

  try
  {
    myToken = await fissionAuthState.fission.tokens.tryGetMyToken();
  }
  catch (e)
  {
    window.o.publishEvent(new ProgressSignal("omo.safe:1:initialize", "Loading your token (from the blockchain) ..", 0));
  }

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
        createdInBlockNo: mySignup.createdInBlockNo,
        noTransactionsUntilBlockNo: mySignup.noTransactionsUntilBlockNo
      }
    }
  }

  setDappState<OmoSafeState>("omo.safe:1", currentState =>
  {
    if (!myToken)
      return currentState;

    const t = new CirclesToken(safeState.mySafeAddress);
    t.tokenOwner = myToken.tokenOwner;
    t.tokenAddress = myToken.tokenAddress;
    t.balance = new BN("0");
    t.createdInBlockNo = myToken.createdInBlockNo;
    t.noTransactionsUntilBlockNo = myToken.noTransactionsUntilBlockNo;

    return {
      ...currentState,
      myToken: t
    };
  });
}

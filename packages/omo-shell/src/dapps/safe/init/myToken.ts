import {setDappState, tryGetDappState} from "../../../libs/o-os/loader";
import {OmoSafeState} from "../manifest";
import {BN} from "ethereumjs-util";
import {runWithDrive} from "omo-fission/dist/fissionDrive";
import {Token} from "omo-models/dist/omo/token";
import {ProgressSignal} from "omo-events/dist/signals/progressSignal";
import {CirclesAccount} from "omo-circles/dist/model/circlesAccount";
import {CirclesToken} from "omo-circles/dist/model/circlesToken";

export async function initMyToken()
{
  await runWithDrive(async fissionDrive =>
  {
    const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
    let myToken: Token;

    try
    {
      myToken = await fissionDrive.tokens.tryGetMyToken();
    }
    catch (e)
    {
      window.o.publishEvent(new ProgressSignal("omo.safe:1:initialize", "Loading your token (from the blockchain) ..", 0));
    }

    if (!myToken)
    {
      window.o.logger.log("Couldn't find myToken. Querying from blockchain events ..");
      const mySignup = await new CirclesAccount(safeState.mySafeAddress).tryGetMyToken();
      if (mySignup)
      {
        myToken = {
          name: "me",
          tokenAddress: mySignup.tokenAddress,
          tokenOwner: mySignup.tokenOwner,
          createdInBlockNo: mySignup.createdInBlockNo,
          noTransactionsUntilBlockNo: mySignup.noTransactionsUntilBlockNo - 1
        }

        try
        {
          await fissionDrive.tokens.addMyToken(myToken);
        }
        catch (e)
        {
          window.o.logger.log(e.message ?? "no message - see args for details", e);
        }
      }
    }

    setDappState<OmoSafeState>("omo.safe:1", currentState =>
    {
      if (!myToken)
        return currentState;

      const t = new CirclesToken(
        safeState.mySafeAddress,
        myToken.tokenAddress,
        myToken.tokenOwner,
        myToken.createdInBlockNo,
        myToken.noTransactionsUntilBlockNo);

      return {
        ...currentState,
        myToken: t
      };
    });
  });
}

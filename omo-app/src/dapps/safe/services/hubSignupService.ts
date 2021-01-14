import {SignupAtCirclesContext} from "../processes/omo/signupAtCircles";
import {setDappState, tryGetDappState} from "../../../libs/o-os/loader";
import {OmoSafeState} from "../manifest";
import {GnosisSafeProxy} from "../../../libs/o-circles-protocol/safe/gnosisSafeProxy";
import {CirclesAccount} from "../../../libs/o-circles-protocol/model/circlesAccount";
import {runWithDrive} from "../../../libs/o-fission/fissionDrive";

export const hubSignupService = async (context: SignupAtCirclesContext) =>
{
  await runWithDrive(async fissionDrive =>
  {
    try
    {
      const web3 = context.environment.eth.web3;
      const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
      const ownerAddress = web3
        .eth
        .accounts
        .privateKeyToAccount(safeState.myKey.privateKey)
        .address;

      const gnosisSafeProxy = new GnosisSafeProxy(web3, ownerAddress, safeState.mySafeAddress);

      await context.environment.eth.contracts.hub.signup(
        safeState.myKey.privateKey,
        gnosisSafeProxy
      );

      const circlesAccount = new CirclesAccount(safeState.mySafeAddress);

      const myToken = await circlesAccount.tryGetMyToken();
      await fissionDrive.tokens.addMyToken({
        name: "me",
        tokenAddress: myToken.tokenAddress,
        createdInBlockNo: myToken.createdInBlockNo,
        tokenOwner: myToken.tokenOwner,
        noTransactionsUntilBlockNo: myToken.noTransactionsUntilBlockNo
      });

      setDappState<OmoSafeState>("omo.safe:1", existing =>
      {
        return {
          ...existing,
          myToken: myToken
        }
      });
    }
    catch (e)
    {
      console.error(e);
      throw e;
    }
  });
}

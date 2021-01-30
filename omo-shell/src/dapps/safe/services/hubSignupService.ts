import {SignupAtCirclesContext} from "../processes/omo/signupAtCircles";
import {OmoSafeState} from "../manifest";
import {runWithDrive} from "omo-fission/dist/fissionDrive";
import {GnosisSafeProxy} from "omo-circles/dist/safe/gnosisSafeProxy";
import {CirclesAccount} from "omo-circles/dist/model/circlesAccount";
import {setDappState, tryGetDappState} from "omo-kernel/dist/kernel";

export const hubSignupService = async (context: SignupAtCirclesContext) =>
{
  await runWithDrive(async fissionDrive =>
  {
    try
    {
      const web3 = context.web3;
      const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
      const ownerAddress = web3
        .eth
        .accounts
        .privateKeyToAccount(safeState.myKey.privateKey)
        .address;

      const gnosisSafeProxy = new GnosisSafeProxy(web3, ownerAddress, safeState.mySafeAddress);

      await context.circlesHub.signup(
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

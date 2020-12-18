import {HubAccount} from "../../../libs/o-circles-protocol/model/hubAccount";
import {SignupAtCirclesContext} from "../processes/omo/signupAtCircles";
import {setDappState, tryGetDappState} from "../../../libs/o-os/loader";
import {FissionAuthState} from "../../fissionauth/manifest";
import {OmoSafeState} from "../manifest";
import {GnosisSafeProxy} from "../../../libs/o-circles-protocol/safe/gnosisSafeProxy";

export const hubSignupService = async (context: SignupAtCirclesContext) =>
{
  const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  if (!fissionAuthState.fission) {
    throw new Error("You're not authenticated");
  }

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

  const hubAccount = new HubAccount(context.environment.eth.contracts.hub,
    safeState.mySafeAddress);

  const myToken = await hubAccount.getOwnToken();
  await fissionAuthState.fission.tokens.addMyToken({
    name: "me",
    tokenAddress: myToken.token.address,
    createdInBlockNo: myToken.createdInBlockNo,
    circlesAddress: hubAccount.address
  });

  setDappState<OmoSafeState>("omo.safe:1", existing => {
    return {
      ...existing,
      myToken: myToken
    }
  });
}

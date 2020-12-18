import {ProcessContext} from "../../../libs/o-processes/interfaces/processContext";
import {HubAccount} from "../../../libs/o-circles-protocol/model/hubAccount";
import {tryGetDappState} from "../../../libs/o-os/loader";
import {FissionAuthState} from "../../fissionauth/manifest";
import {OmoSafeState} from "../manifest";
import {GnosisSafeProxy} from "../../../libs/o-circles-protocol/safe/gnosisSafeProxy";

export const requestUbiService = async (context: ProcessContext) =>
{
  const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  if (!fissionAuthState.fission) {
    throw new Error("You're not authenticated");
  }

  const web3 = context.environment.eth.web3;
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
  const ownerAddress = context.environment.eth.web3
    .eth
    .accounts
    .privateKeyToAccount(safeState.myKey.privateKey)
    .address;

  const gnosisSafeProxy = new GnosisSafeProxy(web3, ownerAddress, safeState.mySafeAddress);

  const p = new HubAccount(context.environment.eth.contracts.hub, safeState.mySafeAddress);
  return await p.getUBI(safeState.myKey.privateKey, gnosisSafeProxy);
}

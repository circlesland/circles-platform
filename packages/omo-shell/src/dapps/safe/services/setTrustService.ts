import { BN } from "ethereumjs-util";
import {SetTrustContext} from "../processes/circles/setTrust";
import {GnosisSafeProxy} from "omo-circles/dist/safe/gnosisSafeProxy";

export const setTrustService = async (context: SetTrustContext) =>
{
  const web3 = context.web3;
  const ownerAddress = web3.eth.accounts
    .privateKeyToAccount(context.accountPrivateKey)
    .address;

  const gnosisSafeProxy = new GnosisSafeProxy(web3, ownerAddress, context.mySafeAddress);

  return await context.circlesHub.setTrust(
    context.accountPrivateKey,
    gnosisSafeProxy,
    context.data.trustReceiver.value,
    new BN(100)
  );
}

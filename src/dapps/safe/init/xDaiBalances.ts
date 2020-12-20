import {config} from "../../../libs/o-circles-protocol/config";
import {setDappState, tryGetDappState} from "../../../libs/o-os/loader";
import {OmoSafeState} from "../manifest";
import {CirclesAccount} from "../../../libs/o-circles-protocol/model/circlesAccount";

export async function initXDaiBalances()
{
  const web3 = config.getCurrent().web3();
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");

    const ownerAddress = safeState.myKey ? web3
      .eth
      .accounts
      .privateKeyToAccount(safeState.myKey.privateKey)
      .address
      : undefined;

  const balances = await new CirclesAccount(safeState.mySafeAddress)
    .tryGetXDaiBalance(ownerAddress);

  setDappState<OmoSafeState>("omo.safe:1", (current) => {
    return {
      ...current,
      ...balances
    }
  });
}

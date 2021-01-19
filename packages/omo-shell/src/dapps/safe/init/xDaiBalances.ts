import {OmoSafeState} from "../manifest";
import {config} from "omo-circles/dist/config";
import {CirclesAccount} from "omo-circles/dist/model/circlesAccount";
import {setDappState, tryGetDappState} from "omo-kernel/dist/kernel";

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

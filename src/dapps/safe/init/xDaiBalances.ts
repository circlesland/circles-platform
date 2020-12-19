import {config} from "../../../libs/o-circles-protocol/config";
import {setDappState, tryGetDappState} from "../../../libs/o-os/loader";
import {BN} from "ethereumjs-util";
import {OmoSafeState} from "../manifest";

export async function initXDaiBalances()
{
  const web3 = config.getCurrent().web3();
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
  const balances: {
    accountXDaiBalance?: BN,
    safeXDaiBalance?: BN
  } = {};

  if (safeState.myKey)
  {
    const ownerAddress = web3
      .eth
      .accounts
      .privateKeyToAccount(safeState.myKey.privateKey)
      .address;

    balances.accountXDaiBalance = new BN(await web3.eth.getBalance(ownerAddress));
  }

  if (safeState.mySafeAddress)
  {
    balances.safeXDaiBalance = new BN(await web3.eth.getBalance(safeState.mySafeAddress));
  }

  setDappState<OmoSafeState>("omo.safe:1", (current) => {
    return {
      ...current,
      mySafeXDaiBalance: balances.safeXDaiBalance,
      myAccountXDaiBalance: balances.accountXDaiBalance
    }
  });
}

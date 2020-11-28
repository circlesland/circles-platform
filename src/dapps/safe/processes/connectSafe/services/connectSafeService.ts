import {ConnectSafeContext} from "../connectSafe";
import {mnemonicToEntropy} from "bip39";
import {config} from "../../../../../libs/o-circles-protocol/config";

export const connectSafeService = async (context: ConnectSafeContext) =>
{
  const privateKey = mnemonicToEntropy(context.data.privateKey.value);
  const ownerAddress = config.getCurrent().web3()
    .eth
    .accounts
    .privateKeyToAccount("0x" + privateKey)
    .address;

  localStorage.setItem("omo.address", ownerAddress);
  localStorage.setItem("omo.privateKey", "0x" + privateKey);
  localStorage.setItem("omo.safeAddress", context.data.safeAddress.value);
}

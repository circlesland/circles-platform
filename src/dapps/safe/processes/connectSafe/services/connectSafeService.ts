import {ConnectSafeContext} from "../connectSafe";
import {mnemonicToEntropy} from "bip39";
import {config} from "../../../../../libs/o-circles-protocol/config";
import {GotSafe} from "../../../events/gotSafe";
import {FissionPaths} from "../../../../../libs/o-os/fissionPaths";

export const connectSafeService = async (context: ConnectSafeContext) =>
{
  if(!context.environment.fissionAuth) {
    throw new Error("You're not authenticated.");
  }

  const privateKey = mnemonicToEntropy(context.data.privateKey.value);
  const ownerAddress = config.getCurrent().web3()
    .eth
    .accounts
    .privateKeyToAccount("0x" + privateKey)
    .address;

  if(!context.environment.fissionAuth) {
    throw new Error("You're not authenticated.");
  }
  const fs = context.environment.fissionAuth.fs;

  const appPath = fs.appPath();
  if (!await fs.exists(appPath)) {
    throw new Error("No fission app path for " + appPath);
  }
  if (!(await fs.exists(FissionPaths.keysDir())))
  {
    await fs.mkdir(FissionPaths.keysDir());
    await fs.publish();
  }

  await fs.add(FissionPaths.safe(), JSON.stringify({
    owner: ownerAddress,
    privateKey: "0x" + privateKey,
    address: context.data.safeAddress.value
  }));
  await fs.publish();

  window.o.publishEvent(new GotSafe());
}

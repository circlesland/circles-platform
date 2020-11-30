import {CreateSafeContext} from "../createSafe";
import {config} from "../../../../../libs/o-circles-protocol/config";
import {FissionPaths} from "../../../../../libs/o-os/fissionPaths";

export const createAccountService = async (context: CreateSafeContext) =>
{
  if(!context.environment.fissionAuth) {
    throw new Error("You're not authenticated.");
  }
  context.data.account = {
    type: "ethereumAccount",
    key: "account",
    value: config.getCurrent().web3().eth.accounts.create()
  };
  const fs = context.environment.fissionAuth.fs;

  context.environment.account = context.data.account.value;

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
    owner: context.data.account.value.address,
    privateKey: "0x" + context.data.account.value.privateKey
  }));

  await fs.publish();
}

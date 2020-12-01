import {CreateSafeContext} from "../createSafe";
import {config} from "../../../../../libs/o-circles-protocol/config";

export const createAccountService = async (context: CreateSafeContext) =>
{
  console.log("Creating a new account");

  if(!context.environment.fission) {
    throw new Error("You're not authenticated.");
  }

  const myKey = config.getCurrent().web3().eth.accounts.create();
  await context.environment.fission.keys.addMyKey({
    name: "me",
    privateKey: myKey.privateKey
  });
}

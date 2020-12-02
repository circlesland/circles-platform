import {InitializeAppContext} from "../initializeApp";
import {mnemonicToEntropy} from "bip39";
import {config} from "../../../../../libs/o-circles-protocol/config";
import {GotSafe} from "../../../events/gotSafe";
import {BN} from "ethereumjs-util";
import {GnosisSafeProxy} from "../../../../../libs/o-circles-protocol/safe/gnosisSafeProxy";
import {HubAccount} from "../../../../../libs/o-circles-protocol/model/hubAccount";

export const connectSafeService = async (context: InitializeAppContext) =>
{
  if (!window.o.fission)
  {
    throw new Error("You're not authenticated");
  }

  const privateKey = mnemonicToEntropy(context.data.privateKey.value);
  const ownerAddress = config.getCurrent().web3()
    .eth
    .accounts
    .privateKeyToAccount("0x" + privateKey)
    .address;

  if (!context.environment.eth.web3.utils.isAddress(ownerAddress))
  {
    throw new Error("The private key seems to be invalid because no address could be derived from it.");
  }

  const existingProfile = context.environment.me.myProfile;
  if (!existingProfile) {
    throw new Error("The 'me' profile doesn't exist yet. The safe cannot be linked without a profile.");
  }

  await window.o.fission.keys.addMyKey({
    name: "me",
    privateKey: "0x" + privateKey,
    publicKey: null
  });

  console.log("Linking safe address to profile ..")

  existingProfile.circlesAddress = context.data.safeAddress.value;
  await window.o.fission.profiles.addOrUpdateMyProfile(existingProfile);

  console.log("Updating the context ..")

  // TODO: Find a central place to update the context
  context.environment.me.myAddress = ownerAddress;
  context.environment.me.myKey = {
    name: "me",
    privateKey: "0x" + privateKey
  };

  context.environment.me.myAddressXDaiBalance = new BN(await context.environment.eth.web3.eth.getBalance(ownerAddress));
  context.environment.me.mySafeXDaiBalance = new BN(existingProfile.circlesAddress ? (await context.environment.eth.web3.eth.getBalance(existingProfile.circlesAddress)) : "0");
  context.environment.me.mySafe = new GnosisSafeProxy(context.environment.eth.web3,
    context.environment.me.myAddress,
    existingProfile.circlesAddress);

  console.log("Find token of safe ..")
  const hubAccount = new HubAccount(context.environment.eth.contracts.hub,
    existingProfile.circlesAddress);

  context.environment.me.myToken = await hubAccount.getOwnToken();

  await context.environment.me.myData.tokens.addMyToken({
    name: "me",
    tokenAddress: context.environment.me.myToken.address,
    circlesAddress: hubAccount.address
  });

  window.o.publishEvent(new GotSafe());
}

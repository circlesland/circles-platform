import {ConnectSafeContext} from "../connectSafe";
import {mnemonicToEntropy} from "bip39";
import {config} from "../../../../../libs/o-circles-protocol/config";
import {GotSafe} from "../../../events/gotSafe";

export const connectSafeService = async (context: ConnectSafeContext) =>
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

  existingProfile.circlesAddress = context.data.safeAddress.value;
  await window.o.fission.profiles.addOrUpdateMyProfile(existingProfile);

  window.o.publishEvent(new GotSafe());
}

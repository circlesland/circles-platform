import {InitializeAppContext} from "../initializeApp";
import {mnemonicToEntropy} from "bip39";
import {config} from "../../../../../libs/o-circles-protocol/config";
import {GotSafe} from "../../../events/gotSafe";
import {BN} from "ethereumjs-util";
import {GnosisSafeProxy} from "../../../../../libs/o-circles-protocol/safe/gnosisSafeProxy";
import {HubAccount} from "../../../../../libs/o-circles-protocol/model/hubAccount";
import {ByteString} from "../../../../../libs/o-circles-protocol/interfaces/byteString";
import {cat} from "webnative/ipfs";

function isValidKeyPhrase(value:string) : string|null {
  try
  {
    const privateKey = mnemonicToEntropy(value);
    const ownerAddress = config
      .getCurrent()
      .web3()
      .eth.accounts.privateKeyToAccount("0x" + privateKey).address;

    const valid = config
      .getCurrent()
      .web3()
      .utils.isAddress(ownerAddress);

    if (valid)
    {
      return "0x" + privateKey;
    }
    else
    {
      return null;
    }

  } catch(e) {
    console.log("connect safe with private key phrase failed.")
    return null;
  }
}

function isValidHexKey(value:string) : string|null
{
  if (!value)
    return null;

  try
  {
    let hexString: ByteString;

    if (value.startsWith("0x") && value.length == 66)
    {
      // prefixed hex string
      hexString = value.slice(2);
    }
    else if (value.length == 64)
    {
      // non prefixed hex string
      hexString = value;
    }

    const address = config.getCurrent().web3().eth.accounts.privateKeyToAccount("0x" + hexString).address;
    const isValid = config
      .getCurrent()
      .web3()
      .utils.isAddress(address);

    if (isValid)
      return "0x" + hexString;
    else
      return null;
  }
  catch (e)
  {
    console.log("connect safe with hex private key failed.")
    return null;
  }
}

export const connectSafeService = async (context: InitializeAppContext) =>
{
  if (!window.o.fission)
  {
    throw new Error("You're not authenticated");
  }

  try
  {
    const privateKey = isValidHexKey(context.data.privateKey.value)
      ?? isValidKeyPhrase(context.data.privateKey.value);

    const ownerAddress = config.getCurrent().web3()
      .eth
      .accounts
      .privateKeyToAccount(privateKey)
      .address;

    if (!context.environment.eth.web3.utils.isAddress(ownerAddress))
    {
      throw new Error("The private key seems to be invalid because no address could be derived from it.");
    }

    const existingProfile = context.environment.me.myProfile;
    if (!existingProfile)
    {
      throw new Error("The 'me' profile doesn't exist yet. The safe cannot be linked without a profile.");
    }

    await window.o.fission.keys.addMyKey({
      name: "me",
      privateKey: privateKey,
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
      privateKey: privateKey
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
  catch (e)
  {
    console.error(e);
  }
}

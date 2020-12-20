import { mnemonicToEntropy } from "bip39";
import { BN } from "ethereumjs-util";
import {config} from "../../../libs/o-circles-protocol/config";
import {ByteString} from "../../../libs/o-circles-protocol/interfaces/byteString";
import {HubAccount} from "../../../libs/o-circles-protocol/model/hubAccount";
import {ConnectSafeContext} from "../processes/omo/importCircles";
import {setDappState, tryGetDappState} from "../../../libs/o-os/loader";
import {FissionAuthState} from "../../fissionauth/manifest";
import {OmoSapienState} from "../../omosapien/manifest";
import {OmoSafeState} from "../manifest";


function isValidKeyPhrase(value: string): string | null {
  try {
    const privateKey = mnemonicToEntropy(value);
    const ownerAddress = config
      .getCurrent()
      .web3()
      .eth.accounts.privateKeyToAccount("0x" + privateKey).address;

    const valid = config
      .getCurrent()
      .web3()
      .utils.isAddress(ownerAddress);

    if (valid) {
      return "0x" + privateKey;
    }
    else {
      return null;
    }

  } catch (e) {
    console.log("connect safe with private key phrase failed.")
    return null;
  }
}

function isValidHexKey(value: string): string | null {
  if (!value)
    return null;

  try {
    let hexString: ByteString;

    if (value.startsWith("0x") && value.length == 66) {
      // prefixed hex string
      hexString = value.slice(2);
    }
    else if (value.length == 64) {
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
  catch (e) {
    console.log("connect safe with hex private key failed.")
    return null;
  }
}

export const connectSafeService = async (context: ConnectSafeContext) =>
{
  const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  if (!fissionAuthState.fission) {
    throw new Error("You're not authenticated");
  }

  const omosapienState = tryGetDappState<OmoSapienState>("omo.sapien:1");
  if (!omosapienState?.myProfile) {
    throw new Error("You don't have a profile yet. The safe cannot be linked without a profile.");
  }

  const web3 = config.getCurrent().web3();

  try
  {
    const privateKey = isValidHexKey(context.data.privateKey.value)
      ?? isValidKeyPhrase(context.data.privateKey.value);

    const ownerAddress = web3
      .eth
      .accounts
      .privateKeyToAccount(privateKey)
      .address;

    if (!web3.utils.isAddress(ownerAddress)) {
      throw new Error("The private key seems to be invalid because no address could be derived from it.");
    }

    await fissionAuthState.fission.keys.addMyKey({
      name: "me",
      privateKey: privateKey,
      publicKey: null
    });

    console.log("Linking safe address to profile ..")

    omosapienState.myProfile.circlesAddress = context.data.safeAddress.value;
    await fissionAuthState.fission.profiles.addOrUpdateMyProfile(omosapienState.myProfile);

    setDappState<OmoSapienState>("omo.sapien", current => {
      return {
        myProfile: omosapienState.myProfile
      }
    });

    setDappState<OmoSafeState>("omo.safe:1", current => {
      return {
        ...current,
        myKey: {
          name: "me",
          privateKey: privateKey,
          publicKey: null
        },
        mySafeAddress: omosapienState.myProfile.circlesAddress
      }
    });

    const myAccountXDaiBalance = new BN(await web3.eth.getBalance(ownerAddress));
    const mySafeXDaiBalance = new BN(omosapienState.myProfile.circlesAddress
      ? (await web3.eth.getBalance(omosapienState.myProfile.circlesAddress))
      : "0");

    console.log("Find token of safe ..")
    const hubAccount = new HubAccount(context.environment.eth.contracts.hub,
      omosapienState.myProfile.circlesAddress);

    const myToken = await hubAccount.getOwnToken();

    await fissionAuthState.fission.tokens.addMyToken({
      name: "me",
      tokenAddress: myToken.token.address,
      tokenOwner: hubAccount.address,
      createdInBlockNo: myToken.createdInBlockNo
    });

    setDappState<OmoSafeState>("omo.safe:1", current => {
      return {
        ...current,
        myKey: {
          name: "me",
          privateKey: privateKey,
          publicKey: null
        },
        mySafeAddress: omosapienState.myProfile.circlesAddress,
        myToken: myToken,
        myAccountXDaiBalance: myAccountXDaiBalance,
        mySafeXDaiBalance: mySafeXDaiBalance
      }
    });
  }
  catch (e)
  {
    console.error(e);
  }
}

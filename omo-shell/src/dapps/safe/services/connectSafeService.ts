import { mnemonicToEntropy } from "bip39";
import { BN } from "ethereumjs-util";
import {ConnectSafeContext} from "../processes/omo/importCircles";
import {OmoSapienState} from "../../omosapien/manifest";
import {OmoSafeState} from "../manifest";
import {config} from "omo-circles/dist/config";
import {runWithDrive} from "omo-fission/dist/fissionDrive";
import {CirclesAccount} from "omo-circles/dist/model/circlesAccount";
import {setDappState, tryGetDappState} from "omo-kernel/dist/kernel";


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
    window.o.logger.log("connect safe with private key phrase failed.")
    return null;
  }
}

function isValidHexKey(value: string): string | null {
  if (!value)
    return null;

  try {
    let hexString: string;

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
    window.o.logger.log("connect safe with hex private key failed.")
    return null;
  }
}

export const connectSafeService = async (context: ConnectSafeContext) =>
{
  await runWithDrive(async fissionDrive =>
  {
    const omosapienState = tryGetDappState<OmoSapienState>("omo.sapien:1");
    if (!omosapienState?.myProfile)
    {
      throw new Error("You don't have a profile yet. The safe cannot be linked without a profile.");
    }

    const web3 = config.getCurrent().web3();

    const privateKey = isValidHexKey(context.data.privateKey.value)
      ?? isValidKeyPhrase(context.data.privateKey.value);

    const ownerAddress = web3
      .eth
      .accounts
      .privateKeyToAccount(privateKey)
      .address;

    if (!web3.utils.isAddress(ownerAddress))
    {
      throw new Error("The private key seems to be invalid because no address could be derived from it.");
    }

    const existingKey = await fissionDrive.keys.tryGetMyKey();
    if (existingKey && existingKey.privateKey != privateKey)
    {
      throw new Error("Trying to overwrite your existing private key. This is not allowed.");
    }
    if (!existingKey)
    {
      await fissionDrive.keys.addMyKey({
        name: "me",
        privateKey: privateKey,
        publicKey: null
      });
    }

    window.o.logger.log("Linking safe address to profile ..")

    omosapienState.myProfile.circlesAddress = context.data.safeAddress.value;
    await fissionDrive.profiles.addOrUpdateMyProfile(omosapienState.myProfile);

    setDappState<OmoSapienState>("omo.sapien", current =>
    {
      return {
        myProfile: omosapienState.myProfile
      }
    });

    setDappState<OmoSafeState>("omo.safe:1", current =>
    {
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

    window.o.logger.log("Find token of safe ..")
    const circlesAccount = new CirclesAccount(omosapienState.myProfile.circlesAddress);
    const myToken = await circlesAccount.tryGetMyToken();

    await fissionDrive.tokens.addMyToken({
      name: "me",
      tokenAddress: myToken.tokenAddress,
      tokenOwner: circlesAccount.safeAddress,
      createdInBlockNo: myToken.createdInBlockNo,
      noTransactionsUntilBlockNo: myToken.noTransactionsUntilBlockNo
    });

    setDappState<OmoSafeState>("omo.safe:1", current =>
    {
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
  });
}

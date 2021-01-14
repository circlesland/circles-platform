import {entropyToMnemonic, mnemonicToEntropy} from "bip39";
import {config} from "../../../libs/o-circles-protocol/config";
import {ByteString} from "../../../libs/o-circles-protocol/interfaces/byteString";
import {ProcessArtifact} from "../../../libs/o-processes/interfaces/processArtifact";
import {ImportPrivateKeyContext} from "../processes/omo/importPrivateKey";
import {runWithDrive} from "../../../libs/o-fission/fissionDrive";

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
    window.o.logger.log("connect safe with hex private key failed.")
    return null;
  }
}


export const importPrivateKeyService = async (context: ImportPrivateKeyContext) =>
{
  await runWithDrive(async fissionDrive =>
  {
    window.o.logger.log("Importing an exising account");

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

    await fissionDrive.keys.addMyKey({
      name: "me",
      privateKey: privateKey
    });

    context.data.privateKey = <ProcessArtifact>{
      key: "privateKey",
      type: "string",
      value: privateKey,
      isReadonly: true
    };

    context.data.privateKeyPhrase = <ProcessArtifact>{
      key: "privateKeyPhrase",
      type: "string",
      value: entropyToMnemonic(privateKey.replace("0x", "")),
      isReadonly: true
    };
  });
}

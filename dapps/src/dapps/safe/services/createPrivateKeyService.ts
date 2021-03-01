import {entropyToMnemonic} from "bip39";
import {CreatePrivateKeyContext} from "../processes/omo/createPrivateKey";
import {OmoSafeState} from "../manifest";
import {runWithDrive} from "omo-fission/dist/fissionDrive";
import {ProcessArtifact} from "omo-process/dist/interfaces/processArtifact";
import {setDappState} from "omo-kernel/dist/kernel";

export const createPrivateKeyService = async (context: CreatePrivateKeyContext) =>
{
  await runWithDrive(async fissionDrive =>
  {
    window.o.logger.log("Creating a new account");

    const web3 = context.web3;
    const newKey = web3.eth.accounts.create();

    await fissionDrive.keys.addMyKey({
      name: "me",
      privateKey: newKey.privateKey
    });

    setDappState<OmoSafeState>("omo.safe:1", current =>
    {
      return {
        ...current,
        myKey: {
          name: "me",
          ...newKey
        }
      };
    });

    context.data.privateKey = <ProcessArtifact>{
      key: "privateKey",
      type: "string",
      value: newKey.privateKey,
      isReadonly: true
    };

    context.data.privateKeyPhrase = <ProcessArtifact>{
      key: "privateKeyPhrase",
      type: "string",
      value: entropyToMnemonic(newKey.privateKey.replace("0x", "")),
      isReadonly: true
    };
  });
}

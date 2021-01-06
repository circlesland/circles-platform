import {entropyToMnemonic} from "bip39";
import {ProcessArtifact} from "../../../libs/o-processes/interfaces/processArtifact";
import {CreatePrivateKeyContext} from "../processes/omo/createPrivateKey";
import {setDappState, tryGetDappState} from "../../../libs/o-os/loader";
import {FissionAuthState} from "../../fissionauth/manifest";
import {OmoSafeState} from "../manifest";
import {runWithDrive} from "../../../libs/o-fission/initFission";

export const createPrivateKeyService = async (context: CreatePrivateKeyContext) =>
{
  await runWithDrive(async fissionDrive =>
  {
    console.log("Creating a new account");

    const web3 = context.environment.eth.web3;
    const newKey = web3.eth.accounts.create();

    await fissionDrive.keys.addMyKey({
      name: "me",
      privateKey: newKey.privateKey
    });

    setDappState<OmoSafeState>("omo.safe:1", current =>
    {
      return {
        ...current,
        myKey: newKey
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

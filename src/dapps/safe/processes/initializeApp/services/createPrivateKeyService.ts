import { InitializeAppContext } from "../initializeApp";
import { ProcessArtifact } from "../../../../../libs/o-processes/interfaces/processArtifact";

export const createPrivateKeyService = async (context: InitializeAppContext) => {
  console.log("Creating a new account");

  if (!context.environment.fission) {
    throw new Error("You're not authenticated.");
  }

  // TODO: Find a central place to update the context
  const newKey = context.environment.eth.web3.eth.accounts.create();
  const myKey = await context.environment.fission.keys.addMyKey({
    name: "me",
    privateKey: newKey.privateKey
  });

  context.environment.me.myAddress = newKey.address;
  context.environment.me.myKey = myKey.entity;

  context.data.privateKey = <ProcessArtifact>{
    key: "privateKey",
    type: "string",
    value: context.environment.me.myKey?.privateKey,
    isReadonly: true
  };
}

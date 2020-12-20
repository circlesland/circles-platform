import {BehaviorSubject} from "rxjs";
import {config} from "../../../libs/o-circles-protocol/config";
import {CirclesHub} from "../../../libs/o-circles-protocol/circles/circlesHub";
import {setDappState, tryGetDappState} from "../../../libs/o-os/loader";
import {BN} from "ethereumjs-util";
import {OmoSafeState, Token} from "../manifest";
import {BlockIndex} from "./blockIndex";
import {DelayedTrigger} from "../../../libs/o-os/delayedTrigger";

const myKnownTokensSubject: BehaviorSubject<{ [safeAddress: string]: Token }> = new BehaviorSubject<{ [safeAddress: string]: Token }>({});
const blockIndex = new BlockIndex();
const myKnownTokens: { [safeAddress: string]: Token } = {};
const updateTrigger = new DelayedTrigger(30, async () => {
  myKnownTokensSubject.next(myKnownTokens);
});

export async function initMyKnownTokens()
{
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");

  const cfg = config.getCurrent();
  const web3 = config.getCurrent().web3();
  const hub = new CirclesHub(web3, cfg.HUB_ADDRESS);

  // Update the token list whenever the contact list changes.
  // Don't subscribe to the events since Signup events happen only one time per safe.
  safeState.myContacts.subscribe(async contactList =>
  {
    const newContacts = contactList.filter(contact => !myKnownTokens[contact.safeAddress]);
    const newContactsSignupEvents = await hub.queryEvents(
      CirclesHub.queryPastSignups(newContacts.map(o => o.safeAddress))
    ).toArray();

    newContactsSignupEvents.forEach(signupEvent =>
    {
      blockIndex.addBlock(signupEvent.blockNumber.toNumber());
      myKnownTokens[signupEvent.returnValues.user] = {
        tokenAddress: signupEvent.returnValues.token,
        createdInBlockNo: signupEvent.blockNumber.toNumber(),
        ownerSafeAddress: signupEvent.returnValues.user,
        balance: new BN("0")
      };
    });

    updateTrigger.trigger();
  });

  setDappState<OmoSafeState>("omo.safe:1", existing =>
  {
    return {
      ...existing,
      myKnownTokens: myKnownTokensSubject
    }
  });
}

import {BehaviorSubject} from "rxjs";
import {setDappState, tryGetDappState} from "../../../libs/o-os/loader";
import {OmoSafeState} from "../manifest";
import {BlockIndex} from "./blockIndex";
import {DelayedTrigger} from "../../../libs/o-os/delayedTrigger";
import {CirclesToken} from "../../../libs/o-circles-protocol/queryModel/circlesToken";
import {CirclesAccount} from "../../../libs/o-circles-protocol/queryModel/circlesAccount";

const myKnownTokensSubject: BehaviorSubject<{ [safeAddress: string]: CirclesToken }> = new BehaviorSubject<{ [safeAddress: string]: CirclesToken }>({});
const blockIndex = new BlockIndex();
const myKnownTokens: { [safeAddress: string]: CirclesToken } = {};
const updateTrigger = new DelayedTrigger(30, async () => {
  myKnownTokensSubject.next(myKnownTokens);
});

export async function initMyKnownTokens()
{
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
  const circlesAccount = new CirclesAccount(safeState.mySafeAddress);

  // Update the token list whenever the contact list changes.
  // Don't subscribe to the events since Signup events happen only one time per safe.
  safeState.myContacts.subscribe(async contactList =>
  {
    const newContacts = contactList.filter(contact => !myKnownTokens[contact.safeAddress]);
    const newTokens = await circlesAccount.tryGetTokensBySafeAddress(newContacts.map(o => o.safeAddress));

    newTokens.forEach(token =>
    {
      blockIndex.addBlock(token.createdInBlockNo);
      myKnownTokens[token.tokenOwner] = token;
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

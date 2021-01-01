import {BehaviorSubject} from "rxjs";
import {setDappState, tryGetDappState} from "../../../libs/o-os/loader";
import {OmoSafeState} from "../manifest";
import {DelayedTrigger} from "../../../libs/o-os/delayedTrigger";
import {CirclesToken} from "../../../libs/o-circles-protocol/model/circlesToken";
import {CirclesAccount} from "../../../libs/o-circles-protocol/model/circlesAccount";
import {BlockIndex} from "../../../libs/o-os/blockIndex";
import {FissionAuthState} from "../../fissionauth/manifest";
import {Token} from "../../../libs/o-fission/entities/token";
import {ProgressSignal} from "../../../libs/o-circles-protocol/interfaces/blockchainEvent";

const myKnownTokensSubject: BehaviorSubject<{ [safeAddress: string]: CirclesToken }> = new BehaviorSubject<{ [safeAddress: string]: CirclesToken }>({});
const blockIndex = new BlockIndex();
const myKnownTokens: { [safeAddress: string]: CirclesToken } = {};

const storeToCacheTrigger = new DelayedTrigger(5000, async () =>
{
  const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  await Promise.all(Object.values(myKnownTokens).map(async knownToken =>
  {
    await fissionAuthState.fission.tokens.addOrUpdate({
      name: knownToken.tokenAddress,
      tokenOwner: knownToken.tokenOwner,
      tokenAddress: knownToken.tokenAddress,
      createdInBlockNo: knownToken.createdInBlockNo,
      noTransactionsUntilBlockNo: knownToken.noTransactionsUntilBlockNo
    }, false);

    await fissionAuthState.fission.tokens.publish();
  }));
});
const updateTrigger = new DelayedTrigger(30, async () =>
{
  myKnownTokensSubject.next(myKnownTokens);
  storeToCacheTrigger.trigger();
});

export async function initMyKnownTokens()
{
  const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
  const circlesAccount = new CirclesAccount(safeState.mySafeAddress);

  let cachedTokens:Token[] = [];
  try
  {
    cachedTokens = await fissionAuthState.fission.tokens.listItems();
    if (cachedTokens && cachedTokens.length > 0)
    {
      cachedTokens.forEach(cachedToken =>
      {
        const token = new CirclesToken(safeState.mySafeAddress);
        token.createdInBlockNo = cachedToken.createdInBlockNo;
        token.tokenAddress = cachedToken.tokenAddress;
        token.tokenOwner = cachedToken.tokenOwner;
        token.noTransactionsUntilBlockNo = cachedToken.noTransactionsUntilBlockNo;

        myKnownTokens[token.tokenOwner] = token;
      });

      myKnownTokensSubject.next(myKnownTokens);
    }
  }
  catch (e)
  {
    window.o.publishEvent(new ProgressSignal("omo.safe:1:initialize", "Loading your contacts' tokens (failed) ..", 0));
  }

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

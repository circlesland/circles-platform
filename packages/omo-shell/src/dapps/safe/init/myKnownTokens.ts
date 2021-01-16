import {BehaviorSubject} from "rxjs";
import {setDappState, tryGetDappState} from "../../../libs/o-os/loader";
import {OmoSafeState} from "../manifest";
import {CirclesToken} from "../../../libs/o-circles-protocol/model/circlesToken";
import {CirclesAccount} from "../../../libs/o-circles-protocol/model/circlesAccount";
import {BlockIndex} from "../../../libs/o-os/blockIndex";
import {Token} from "../../../libs/o-fission/entities/token";
import {ProgressSignal} from "../../../libs/o-circles-protocol/interfaces/blockchainEvent";
import {CachedTokens} from "../../../libs/o-fission/entities/cachedTokens";
import {runWithDrive} from "../../../libs/o-fission/fissionDrive";
import {Envelope} from "../../../libs/o-os/interfaces/envelope";
import {DelayedTrigger} from "omo-utils/dist/delayedTrigger";

const myKnownTokensSubject: BehaviorSubject<Envelope<{ [safeAddress: string]: CirclesToken }>> = new BehaviorSubject<Envelope<{ [safeAddress: string]: CirclesToken }>>({
  payload: {}
});
const blockIndex = new BlockIndex();
const myKnownTokens: { [safeAddress: string]: CirclesToken } = {};

const storeToCacheTrigger = new DelayedTrigger(500, async () =>
{
  await runWithDrive(async fissionDrive =>
  {
    const existingKnownTokensList = (await fissionDrive.tokens.tryGetEntityByName("tokens")) ?? <CachedTokens>{
      name: "tokens",
      entries: {}
    };
    const existingKnownTokens = existingKnownTokensList.entries;

    Object.values(myKnownTokens).forEach(token =>
    {
      existingKnownTokens[token.tokenAddress] = <Token>{
        name: token.tokenAddress,
        noTransactionsUntilBlockNo: token.noTransactionsUntilBlockNo,
        createdInBlockNo: token.createdInBlockNo,
        tokenAddress: token.tokenAddress,
        tokenOwner: token.tokenOwner
      };
    });

    existingKnownTokensList.entries = existingKnownTokens;
    await fissionDrive.tokens.addOrUpdateEntity(existingKnownTokensList);
  });
});

const updateTrigger = new DelayedTrigger(30, async () =>
{
  const current = myKnownTokensSubject.getValue();
  myKnownTokensSubject.next({
    payload:myKnownTokens,
    signal: current.signal
  });
  storeToCacheTrigger.trigger();
});

export async function initMyKnownTokens()
{
  await runWithDrive(async fissionDrive =>
  {
    const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
    const circlesAccount = new CirclesAccount(safeState.mySafeAddress);

    try
    {
      const existingKnownTokensList = await fissionDrive.tokens.tryGetEntityByName("tokens");
      if (existingKnownTokensList)
      {
        const existingKnownTokens = existingKnownTokensList.entries;
        Object.values(existingKnownTokens).forEach(cachedToken =>
        {
          const token = new CirclesToken(safeState.mySafeAddress);
          token.createdInBlockNo = cachedToken.createdInBlockNo;
          token.tokenAddress = cachedToken.tokenAddress;
          token.tokenOwner = cachedToken.tokenOwner;
          token.noTransactionsUntilBlockNo = cachedToken.noTransactionsUntilBlockNo;

          myKnownTokens[token.tokenOwner] = token;
        });
        const current = myKnownTokensSubject.getValue();
        myKnownTokensSubject.next({
          payload: myKnownTokens,
          signal: current?.signal
        });
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
      const newContacts = contactList.payload.filter(contact => !myKnownTokens[contact.safeAddress]);
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
  });
}

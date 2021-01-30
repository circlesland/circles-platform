import {OmoSafeState} from "../manifest";
import {BlockIndex} from "../../../libs/o-os/blockIndex";
import {DelayedTrigger} from "omo-utils/dist/delayedTrigger";
import {StatePropagation} from "omo-kernel-interfaces/dist/statePropagation";
import {CirclesToken} from "omo-circles/dist/model/circlesToken";
import {runWithDrive} from "omo-fission/dist/fissionDrive";
import {Token} from "omo-models/dist/omo/token";
import {CirclesAccount} from "omo-circles/dist/model/circlesAccount";
import {ProgressSignal} from "omo-events/dist/signals/progressSignal";
import {CachedTokens} from "omo-models/dist/omo/cachedTokens";
import {OmoBehaviorSubject} from "omo-quirks/dist/OmoBehaviorSubject";
import {setDappState, tryGetDappState} from "omo-kernel/dist/kernel";
import {UnavailableSignal} from "omo-events/dist/signals/unavailableSignal";

const myKnownTokensSubject: OmoBehaviorSubject<StatePropagation<{ [safeAddress: string]: CirclesToken }>> = new OmoBehaviorSubject<StatePropagation<{ [safeAddress: string]: CirclesToken }>>({
  signal: new UnavailableSignal(),
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
          const token = new CirclesToken(
            safeState.mySafeAddress,
            cachedToken.tokenAddress,
            cachedToken.tokenOwner,
            cachedToken.createdInBlockNo,
            cachedToken.noTransactionsUntilBlockNo);

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
      window.o.publishEvent(new ProgressSignal("Loading your contacts' tokens (failed) ..", 0));
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

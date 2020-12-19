import {BehaviorSubject} from "rxjs";
import {config} from "../../../libs/o-circles-protocol/config";
import {CirclesHub} from "../../../libs/o-circles-protocol/circles/circlesHub";
import {setDappState, tryGetDappState} from "../../../libs/o-os/loader";
import {FissionAuthState} from "../../fissionauth/manifest";
import {BN} from "ethereumjs-util";
import {OmoSafeState, Token} from "../manifest";

export async function initMyKnownTokens ()
{
  console.log("initMyKnownTokens()")

  const myKnownTokensSubject: BehaviorSubject<{[safeAddress:string]:Token}> = new BehaviorSubject<{[safeAddress:string]:Token}>({});

  const alreadySeenSafes:{[safeAddress:string]:boolean} = {};
  const knownTokens:{[safeAddress:string]:Token} = {};

  const cfg = config.getCurrent();
  const web3 = config.getCurrent().web3();
  const hub = new CirclesHub(web3, cfg.HUB_ADDRESS);

  const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");

  // Load the known tokens from the fission cache
  const allTokens = await fissionAuthState.fission.tokens.listItems();
  allTokens.forEach(cachedToken => {
    knownTokens[cachedToken.circlesAddress] = {
      createdInBlockNo: cachedToken.createdInBlockNo,
      tokenAddress: cachedToken.tokenAddress,
      ownerSafeAddress: cachedToken.circlesAddress,
      balance: new BN("0")
    };
  });
  console.log("Loaded " + allTokens.length + " tokens from the fission cache.");
  myKnownTokensSubject.next(knownTokens);

  // Update the token list whenever the contact list changes
  safeState.myContacts.subscribe(async contactList =>
  {
    // Only contacts for which we don't have the token already are relevant
    const newContacts = contactList.filter(contact => {
      const alreadySeen = alreadySeenSafes[contact.safeAddress];
      if (!alreadySeen)
      {
        alreadySeenSafes[contact.safeAddress] = true;
      }

      return !alreadySeen;
    });

    if (newContacts.length == 0)
    {
      return;
    }

    const newContactsSignupEvents = hub.queryEvents(CirclesHub.queryPastSignups(newContacts.map(o => o.safeAddress)));
    const newContactsSignupArr = await newContactsSignupEvents.toArray();

    const addedTokens = await Promise.all(newContactsSignupArr.map(async signupEvent =>
    {
      const t = {
        tokenAddress: signupEvent.returnValues.token,
        createdInBlockNo: signupEvent.blockNumber.toNumber(),
        ownerSafeAddress: signupEvent.returnValues.user,
        balance: new BN("0")
      };

      console.log(`Adding token to the list of knownTokens: `, t);
      knownTokens[signupEvent.returnValues.user] = t;

      await fissionAuthState.fission.tokens.addOrUpdate({
        name: signupEvent.returnValues.user,
        tokenAddress: signupEvent.returnValues.token,
        circlesAddress: signupEvent.returnValues.user,
        createdInBlockNo: signupEvent.blockNumber.toNumber()
      }, false);

      return 0;
    }));

    if (addedTokens.length > 0)
    {
      await fissionAuthState.fission.tokens.publish();
    }

    myKnownTokensSubject.next(knownTokens);
  });

  setDappState<OmoSafeState>("omo.safe:1", existing => {
    return {
      ...existing,
      myKnownTokens: myKnownTokensSubject
    }
  });
}

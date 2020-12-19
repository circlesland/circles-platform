import {setDappState, tryGetDappState} from "../../../libs/o-os/loader";
import {FissionAuthState} from "../../fissionauth/manifest";
import {config} from "../../../libs/o-circles-protocol/config";
import {BehaviorSubject} from "rxjs";
import {CacheEvent} from "../../../libs/o-fission/entities/cacheEvent";
import {EventStore} from "../../../libs/o-fission/eventStore";
import {CirclesHub} from "../../../libs/o-circles-protocol/circles/circlesHub";
import {Contact, OmoSafeState} from "../manifest";

export async function initMyContacts()
{
  const incomingTrustsName = "Trust_In";
  const outgoingTrustsName = "Trust_Out";

  const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");

  // Look for cached trust events
  const fromBlockNo = safeState.myToken?.createdInBlockNo ?? config.getCurrent().HUB_BLOCK;

  const myContacts:{
    [safeAddress:string]: Contact
  } = {}

  const myContactsSubject: BehaviorSubject<Contact[]> = new BehaviorSubject<Contact[]>([]);

  let lastCachedBlock: number = fromBlockNo;

  function aggregateContacts(trustEvent:CacheEvent)
  {
    const {canSendTo, user, limit} = JSON.parse(trustEvent.data);

    const otherSafeAddress = user == safeState.mySafeAddress
      ? canSendTo
      : user;

    const contact = myContacts[otherSafeAddress]
      ?? <Contact>{
        safeAddress: otherSafeAddress,
        trust: {
          in: 0,
          out: 0
        }
      };

    // If I can send circles to someone, then this person trusts me -> 'in'
    contact.trust.in = user == safeState.mySafeAddress
      ? parseInt(limit ?? "0")
      : contact.trust.in;

    // If someone can send circles to me, then I trust that person -> 'out'
    contact.trust.out = canSendTo == safeState.mySafeAddress
      ? parseInt(limit ?? "0")
      : contact.trust.out;

    myContacts[otherSafeAddress] = contact;

    lastCachedBlock = lastCachedBlock < trustEvent.blockNo
      ? trustEvent.blockNo
      : lastCachedBlock;
  }

  // Go trough all cached trust events (must be ordered from old to new - ASC)
  // and keep only the latest trust values per connection.
  // Keep also track of the latest cached block number.
  const fromDayIdx = Math.floor(fromBlockNo / EventStore.blocksPerDay);
  const cachedTrustEvents = (await fissionAuthState.fission.events.loadEventsFromFs(incomingTrustsName, fromDayIdx))
    .concat(await fissionAuthState.fission.events.loadEventsFromFs(outgoingTrustsName, fromDayIdx));
  cachedTrustEvents.forEach(aggregateContacts);
  myContactsSubject.next(Object.values(myContacts));

  //
  // Connect the event source
  //
  const cfg = config.getCurrent();
  const web3 = config.getCurrent().web3();
  const hub = new CirclesHub(web3, cfg.HUB_ADDRESS);

  //
  // Query all new trust connections and monitor the events
  //
  const myIncomingTrusts = hub.queryEvents(CirclesHub.queryPastTrusts(
    null,
    safeState.mySafeAddress,
    lastCachedBlock));

  const incomingTrustEvents = await fissionAuthState.fission.events.attachEventSource(incomingTrustsName, myIncomingTrusts);
  incomingTrustEvents.subscribe(trustEvent => {
    console.log("New trust event:", trustEvent);
    aggregateContacts({
      blockNo: trustEvent.blockNumber.toNumber(),
      data: JSON.stringify(trustEvent.returnValues),
      source: incomingTrustsName,
      eventType: trustEvent.event,
      blockHash: trustEvent.blockHash,
      senderType: "contract",
      senderRef: trustEvent.address
    });

    myContactsSubject.next(Object.values(myContacts));
  });

  const myOutgoingTrusts = hub.queryEvents(CirclesHub.queryPastTrusts(
    safeState.mySafeAddress,
    null,
    lastCachedBlock));

  const outgoingTrustEvents = await fissionAuthState.fission.events.attachEventSource(outgoingTrustsName, myOutgoingTrusts);
  outgoingTrustEvents.subscribe(trustEvent => {
    console.log("New trust event:", trustEvent);
    aggregateContacts({
      blockNo: trustEvent.blockNumber.toNumber(),
      data: JSON.stringify(trustEvent.returnValues),
      source: incomingTrustsName,
      eventType: trustEvent.event,
      blockHash: trustEvent.blockHash,
      senderType: "contract",
      senderRef: trustEvent.address
    });

    myContactsSubject.next(Object.values(myContacts));
  });

  setDappState<OmoSafeState>("omo.safe:1", existing => {
    return {
      ...existing,
      myContacts: myContactsSubject
    }
  });
}

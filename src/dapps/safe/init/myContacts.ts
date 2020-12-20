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
  const fromBlockNo = config.getCurrent().HUB_BLOCK;
  console.log("initMyContacts() -> fromBlockNo:", fromBlockNo);

  const myContacts: {
    [safeAddress: string]: Contact
  } = {}

  const myContactsSubject: BehaviorSubject<Contact[]> = new BehaviorSubject<Contact[]>([]);

  let lastCachedBlock: number = fromBlockNo;

  function aggregateContacts(trustEvent: CacheEvent)
  {
    const {canSendTo, user, limit} = JSON.parse(trustEvent.data);

    const otherSafeAddress = user == safeState.mySafeAddress
      ? canSendTo
      : user;

    const direction = user == safeState.mySafeAddress
      ? "in"
      : "out";

    if (direction == "in")
    {
      const contact = myContacts[canSendTo]
        ?? <Contact>{
          lastBlockNo: trustEvent.blockNo,
          safeAddress: canSendTo,
          trust: {
            in: limit,
            out: 0
          }
        };

      contact.trust.in = limit;
      contact.lastBlockNo = contact.lastBlockNo <= trustEvent.blockNo ? trustEvent.blockNo : contact.lastBlockNo;

      myContacts[canSendTo] = contact;
    }

    if (direction == "out")
    {
      const contact = myContacts[user]
        ?? <Contact>{
          lastBlockNo: trustEvent.blockNo,
          safeAddress: user,
          trust: {
            in: 0,
            out: limit
          }
        };

      contact.trust.out = limit;
      contact.lastBlockNo = contact.lastBlockNo <= trustEvent.blockNo ? trustEvent.blockNo : contact.lastBlockNo;

      myContacts[user] = contact;
    }

    lastCachedBlock = lastCachedBlock < trustEvent.blockNo
      ? trustEvent.blockNo + 1
      : lastCachedBlock;
  }

  // Go trough all cached trust events (must be ordered from old to new - ASC)
  // and keep only the latest trust values per connection.
  // Keep also track of the latest cached block number.
  const fromDayIdx = Math.floor(fromBlockNo / EventStore.pageSize);
  console.log("initMyContacts() -> loading cached events from day:", fromDayIdx);

  const cachedIncomingTrustEvents = await fissionAuthState.fission.events.loadEventsFromFs(incomingTrustsName, fromDayIdx);
  console.log("initMyContacts() -> got cachedIncomingTrustEvents:", cachedIncomingTrustEvents);

  const cachedOutgoingTrustEvents = await fissionAuthState.fission.events.loadEventsFromFs(outgoingTrustsName, fromDayIdx);
  console.log("initMyContacts() -> got cachedOutgoingTrustEvents:", cachedOutgoingTrustEvents);

  const cachedTrustEvents = cachedIncomingTrustEvents.concat(cachedOutgoingTrustEvents);
  console.log("initMyContacts() -> got all cached trust events:", JSON.parse(JSON.stringify(cachedTrustEvents)));

  cachedTrustEvents.sort(o => o.blockNo);
  console.log("initMyContacts() -> got all cached trust events (sorted):", cachedTrustEvents);
  cachedTrustEvents.forEach(aggregateContacts);
  console.log("initMyContacts() -> myContactsSubject.next(Object.values(myContacts));", myContacts);
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
  incomingTrustEvents.subscribe(trustEvent =>
  {
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
  outgoingTrustEvents.subscribe(trustEvent =>
  {
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

  setDappState<OmoSafeState>("omo.safe:1", existing =>
  {
    return {
      ...existing,
      myContacts: myContactsSubject
    }
  });
}

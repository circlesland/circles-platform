import {setDappState, tryGetDappState} from "../../../libs/o-os/loader"
import {config} from "../../../libs/o-circles-protocol/config";
import {BehaviorSubject} from "rxjs";
import {CacheEvent} from "../../../libs/o-fission/entities/cacheEvent";
import {CirclesHub} from "../../../libs/o-circles-protocol/circles/circlesHub";
import {CirclesProfile, Contact, OmoSafeState} from "../manifest";
import {BlockIndex} from "./blockIndex";
import {DelayedTrigger} from "../../../libs/o-os/delayedTrigger";

const myContactsSubject: BehaviorSubject<Contact[]> = new BehaviorSubject<Contact[]>([]);
const blockIndex = new BlockIndex();
const myContacts:{[safeAddress:string]:Contact} = {};
const circlesProfiles:{[safeAddress:string]:CirclesProfile} = {};
const updateTrigger = new DelayedTrigger(30, async () =>
{
  const circlesApiUrls = Object.values(myContacts)
    .filter(o => !circlesProfiles[o.safeAddress])
    .map(o => {
      circlesProfiles[o.safeAddress] = {
        safeAddress: o.safeAddress,
        loaded: false
      };
      return "address[]=" + o.safeAddress;
    }).join("&");

  if (circlesApiUrls !== "")
  {
    const url = "https://api.circles.garden/api/users/?" + circlesApiUrls;
    const response = await fetch(url);
    const responseJson = await response.json();

    responseJson.data.forEach(entry =>
    {
      circlesProfiles[entry.safeAddress] = entry;
      myContacts[entry.safeAddress].circlesProfile = entry;
    });
  }

  myContactsSubject.next(Object.values(myContacts));
});

export async function initMyContacts()
{
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");

  const cfg = config.getCurrent();
  const web3 = config.getCurrent().web3();
  const hub = new CirclesHub(web3, cfg.HUB_ADDRESS);

  const myIncomingTrusts = await hub.queryEvents(CirclesHub.queryPastTrusts(null, safeState.mySafeAddress));
  myIncomingTrusts.events.subscribe(trustEvent =>
  {
    indexContact(safeState, toCacheEvent("Trust_In", trustEvent));
    updateTrigger.trigger();
  });

  myIncomingTrusts.execute();

  const myOutgoingTrusts = await hub.queryEvents(CirclesHub.queryPastTrusts(safeState.mySafeAddress, null));
  myOutgoingTrusts.events.subscribe(trustEvent =>
  {
    indexContact(safeState, toCacheEvent("Trust_Out", trustEvent));
    updateTrigger.trigger();
  });

  myOutgoingTrusts.execute();

  setDappState<OmoSafeState>("omo.safe:1", existing =>
  {
    return {
      ...existing,
      myContacts: myContactsSubject
    }
  });
}

function indexContact(safeState:OmoSafeState, trustEvent: CacheEvent)
{
  const {canSendTo, user, limit} = JSON.parse(trustEvent.data);

  const direction = user == safeState.mySafeAddress
    ? "in"
    : "out";

  blockIndex.addSnapshot("lastBlockNo", trustEvent.blockNo);

  if (direction == "in")
  {
    const contact = myContacts[canSendTo]
      ?? <Contact>{
        lastBlockNo: trustEvent.blockNo,
        safeAddress: canSendTo,
        trust: {
          in: parseInt(limit),
          out: null
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
          in: null,
          out: parseInt(limit)
        }
      };

    contact.trust.out = limit;
    contact.lastBlockNo = contact.lastBlockNo <= trustEvent.blockNo ? trustEvent.blockNo : contact.lastBlockNo;

    myContacts[user] = contact;
  }

  blockIndex.addBlock(trustEvent.blockNo);
}

function toCacheEvent(source:string, event) {
  return <CacheEvent>{
    blockNo: event.blockNumber.toNumber(),
    data: JSON.stringify(event.returnValues),
    source: source,
    eventType: event.event,
    blockHash: event.blockHash,
    senderType: "contract",
    senderRef: event.address
  }
}

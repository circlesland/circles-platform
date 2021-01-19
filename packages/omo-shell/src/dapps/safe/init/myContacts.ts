import {OmoSafeState} from "../manifest";
import {BlockIndex} from "../../../libs/o-os/blockIndex";
import {OmoSapienState} from "../../omosapien/manifest";
import {DelayedTrigger} from "omo-utils/dist/delayedTrigger";
import {ProfileIndex} from "omo-indexes/dist/profileIndex";
import {StatePropagation} from "omo-kernel-interfaces/dist/statePropagation";
import {Contact} from "omo-models/dist/omo/contact";
import {CirclesProfile} from "omo-models/dist/circles/circlesProfile";
import {runWithDrive} from "omo-fission/dist/fissionDrive";
import {CirclesAccount} from "omo-circles/dist/model/circlesAccount";
import {BlockchainEvent} from "omo-events/dist/blockchainEvent";
import {OmoBehaviorSubject} from "omo-quirks/dist/OmoBehaviorSubject";
import {setDappState, tryGetDappState} from "omo-kernel/dist/kernel";

const myContactsSubject: OmoBehaviorSubject<StatePropagation<Contact[]>> = new OmoBehaviorSubject<StatePropagation<Contact[]>>({
  payload: []
});
const blockIndex = new BlockIndex();
const myContacts:{[safeAddress:string]:Contact} = {};
const circlesProfiles:{[safeAddress:string]:CirclesProfile} = {};

const augmentCirclesProfiles = new DelayedTrigger(30, async () =>
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

  const current = myContactsSubject.getValue();
  myContactsSubject.next({
    signal: current?.signal,
    payload: Object.values(myContacts)
  });
});

const augmentOmoProfiles = new DelayedTrigger(30, async () =>
{
  await runWithDrive(async fissionDrive =>
  {
    const omosapienState = tryGetDappState<OmoSapienState>("omo.sapien:1");
    const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
    await Promise.all(Object.values(myContacts)
      .filter(o =>
        omosapienState.profileIndex
        && omosapienState.profileIndex.getValue().payload.byCirclesSafe[o.safeAddress]
      )
      .map(async o => {
        const directoryEntry = omosapienState.profileIndex.getValue().payload.byCirclesSafe[o.safeAddress];
        try
        {
          if (o.safeAddress == safeState.mySafeAddress)
          {
            o.omoProfile = {
              profile: omosapienState.myProfile,
              avatarCid: await fissionDrive.profiles.tryGetMyAvatar()
            };
          }
          else
          {
            const p = await ProfileIndex.tryReadPublicProfile(directoryEntry.fissionName);
            o.omoProfile = {
              profile: {
                ...p.profile,
                name: ""
              },
              avatarCid: p.avatarCid
            };
            // o.omoProfile = await ForeignProfile.findByFissionUsername(directoryEntry.fissionName);
          }
        } catch (e)
        {
          console.warn("An error occurred while loading the fission contacts:", e);
        }
      }));

    const current = myContactsSubject.getValue();
    myContactsSubject.next({
      signal: current?.signal,
      payload: Object.values(myContacts)
    });
  });
});

const updateTrigger = new DelayedTrigger(30, async () =>
{
  augmentCirclesProfiles.trigger();
  augmentOmoProfiles.trigger();
  const current = myContactsSubject.getValue();
  myContactsSubject.next({
    signal: current?.signal,
    payload: Object.values(myContacts)
  });
});

export async function initMyContacts()
{
  const safeState = tryGetDappState<OmoSafeState>("omo.safe:1");
  const circlesAccount = new CirclesAccount(safeState.mySafeAddress);

  circlesAccount.subscribeToMyContacts().subscribe(trustEvent =>
  {
    indexContact(safeState, trustEvent);
    updateTrigger.trigger();
  });

  setDappState<OmoSafeState>("omo.safe:1", existing =>
  {
    return {
      ...existing,
      myContacts: myContactsSubject
    }
  });
}

function indexContact(safeState:OmoSafeState, event:BlockchainEvent)
{
  const {canSendTo, user, limit} = event.returnValues;
  const blockNo = event.blockNumber;

  const direction = user == safeState.mySafeAddress
    ? "in"
    : "out";

  blockIndex.addSnapshot("lastBlockNo", blockNo);

  if (direction == "in")
  {
    const contact = myContacts[canSendTo]
      ?? <Contact>{
        lastBlockNo: blockNo,
        safeAddress: canSendTo,
        trust: {
          in: parseInt(limit),
          out: null
        }
      };

    contact.trust.in = limit;
    contact.lastBlockNo = contact.lastBlockNo <= blockNo ? blockNo : contact.lastBlockNo;

    myContacts[canSendTo] = contact;
  }

  if (direction == "out")
  {
    const contact = myContacts[user]
      ?? <Contact>{
        lastBlockNo: blockNo,
        safeAddress: user,
        trust: {
          in: null,
          out: parseInt(limit)
        }
      };

    contact.trust.out = limit;
    contact.lastBlockNo = contact.lastBlockNo <= blockNo ? blockNo : contact.lastBlockNo;

    myContacts[user] = contact;
  }

  blockIndex.addBlock(blockNo);
}

import {FissionPaths} from "./fissionPaths";
import {Profile} from "../../dapps/odentity/interfaces/profile";
import {SafeReference} from "../../dapps/safe/interfaces/SafeReference";
import {stateMachine} from "./stateMachine";
import * as webnative from "webnative";
import {EventBroker} from "./eventBroker";
import {Shell} from "./interfaces/shell";
import {OmoEvent} from "../o-events/omoEvent";
import {Authenticated} from "../../dapps/odentity/events/authenticated";
import {Account} from "../o-circles-protocol/interfaces/account";
import {config} from "../o-circles-protocol/config";
import {CirclesHub} from "../o-circles-protocol/circles/circlesHub";
import {ProcessEnvironment} from "../o-processes/interfaces/processEnvironment";
import {GnosisSafeProxy} from "../o-circles-protocol/safe/gnosisSafeProxy";
import {Person} from "../o-circles-protocol/model/person";

const eventBroker = new EventBroker();
const shellEvents = eventBroker.createTopic("omo", "shell");

export const o:Shell = {
  events: shellEvents.observable,
  publishEvent: event => shellEvents.publish(event),
  fissionAuth: undefined,
  getEnvironment: async () => {
    const safe = await window.o.safe();
    const safeAddress = safe?.address;
    const account: Account = {
      privateKey: safe?.privateKey,
      address: safe?.owner,
    };
    const web3 = config.getCurrent().web3();
    const circlesHub = new CirclesHub(web3, config.getCurrent().HUB_ADDRESS);
    const environment: ProcessEnvironment = {
      safe: (!account.address || !safeAddress) ? null : new GnosisSafeProxy(web3, account.address, safeAddress),
      account: account,
      person: !safeAddress ? null : new Person(circlesHub, safeAddress),
      fissionAuth: window.o.fissionAuth
    };
    return environment;
  },
  profile: async () =>
  {
    if (!window.o.fissionAuth)
      throw new Error("Not authenticated");

    const fs = window.o.fissionAuth.fs;
    if (!(await fs.exists(FissionPaths.profile())))
    {
      return null;
    }
    const profileObj = JSON.parse(<string>(await fs.cat(FissionPaths.profile())));
    return <Profile>profileObj;
  },
  safe: async () =>
  {
    if (!window.o.fissionAuth)
      throw new Error("Not authenticated");

    const fs = window.o.fissionAuth.fs;
    if (!(await fs.exists(FissionPaths.safe())))
    {
      return null;
    }
    const safeObj = JSON.parse(<string>(await fs.cat(FissionPaths.safe())));
    return <SafeReference>safeObj;
  },
  stateMachines: <any>stateMachine,
  wn: webnative
}

o.events.subscribe((event:OmoEvent) => {
  if (event.type === "shell.authenticated") {
    window.o.fissionAuth = (<Authenticated>event).fissionAuth;
  }
});

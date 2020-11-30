import {FissionPaths} from "./fissionPaths";
import {Profile} from "../../dapps/odentity/interfaces/profile";
import {SafeReference} from "../../dapps/safe/interfaces/SafeReference";
import {stateMachine} from "./stateMachine";
import * as webnative from "webnative";
import {EventBroker} from "./eventBroker";
import {Shell} from "./interfaces/shell";
import {OmoEvent} from "../o-events/omoEvent";
import {Authenticated} from "../../dapps/odentity/events/authenticated";

const eventBroker = new EventBroker();
const shellEvents = eventBroker.createTopic("omo", "shell");

export const o:Shell = {
  events: shellEvents.observable,
  publishEvent: event => shellEvents.publish(event),
  fissionAuth: undefined,
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

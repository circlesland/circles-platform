import type { Observable } from "rxjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import App from "src/App.svelte";
import { ProcessDefinition } from "src/libs/o-processes/processManifest";
import { EventBroker } from "./libs/o-os/eventBroker";
import { OmoEvent } from "./libs/o-events/omoEvent";
import * as webnative from "webnative";
import { stateMachine } from "./libs/o-os/stateMachine"
import {ProcessContext} from "./libs/o-processes/interfaces/processContext";
import {AuthSucceeded, Continuation} from "webnative";
import {Profile} from "./dapps/odentity/interfaces/profile";
import {GotProfile} from "./dapps/odentity/events/gotProfile";
import {Authenticated} from "./dapps/odentity/events/authenticated";
import {SafeReference} from "./dapps/safe/interfaces/SafeReference";

dayjs.extend(relativeTime)

export interface Process {
  id: number;
  events: Observable<any>;
  sendEvent(event: any);
}

export interface Shell {
  fissionAuth: AuthSucceeded|Continuation,
  shellEvents: Observable<any>,
  dispatchShellEvent: (event: OmoEvent) => void,
  stateMachines: {
    current(): Process | null,
    cancel(),
    run: (definition: ProcessDefinition, contextModifier?: (processContext: ProcessContext) => ProcessContext) => Process
  },
  safe: () => Promise<SafeReference>
  profile: () => Promise<Profile>,
  wn: any
}

declare global {
  /*
  interface Window {
    mySafeAddress: string,
    eventBroker: EventBroker,
    dispatchShellEvent: (event: OmoEvent) => void,
    stateMachines: {
      current(): Process | null,
      cancel(),
      run: (definition: ProcessDefinition, contextModifier?: (processContext: ProcessContext) => ProcessContext) => Process
    },
    fissionAuth: AuthSucceeded|Continuation,
    wn: any,
    profile: Profile
  }
   */
  interface Window {
    o:Shell
  }
}

const eventBroker = new EventBroker();
const shellEvents = eventBroker.createTopic("omo", "shell");

shellEvents.observable.subscribe((event:OmoEvent) => {
  if (event.type === "shell.authenticated") {
    window.o.fissionAuth = (<Authenticated>event).fissionAuth;
  }
  else if (event.type === "shell.gotProfile") {
    // window.profile = (<GotProfile>event).profile;
  }
});

export class FissionPaths {
  static odentityDir() {
    return window.o.fissionAuth.fs.appPath(["odentity"])
  }
  static profile() {
    return window.o.fissionAuth.fs.appPath(["odentity", "profile.json"])
  }
  static keysDir() {
    return window.o.fissionAuth.fs.appPath(["keys"])
  }
  static safe() {
    return window.o.fissionAuth.fs.appPath(["keys", "safe.json"])
  }
}

window.o = {
  shellEvents: shellEvents.observable,
  dispatchShellEvent: event => shellEvents.publish(event),
  fissionAuth: undefined,
  profile: async () => {
    if (!window.o.fissionAuth)
      throw new Error("Not authenticated");

    const fs = window.o.fissionAuth.fs;
    if (!(await fs.exists(FissionPaths.profile()))) {
      return null;
    }
    const profileObj = JSON.parse(<string>(await fs.cat(FissionPaths.profile())));
    return <Profile>profileObj;
  },
  safe: async () => {
    if (!window.o.fissionAuth)
      throw new Error("Not authenticated");

    const fs = window.o.fissionAuth.fs;
    if (!(await fs.exists(FissionPaths.safe()))) {
      return null;
    }
    const safeObj = JSON.parse(<string>(await fs.cat(FissionPaths.safe())));
    return <SafeReference>safeObj;
  },
  stateMachines: <any>stateMachine,
  wn: webnative
}

const app = new App({
  target: document.body,
});

export default app;

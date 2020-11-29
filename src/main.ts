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

dayjs.extend(relativeTime)

export interface Process {
  id: number;
  events: Observable<any>;
  sendEvent(event: any);
}

declare global {
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
}

window.wn = webnative

window.mySafeAddress = localStorage.getItem("omo.safeAddress");

const eventBroker = new EventBroker();
const shellEvents = eventBroker.createTopic("omo", "shell");

shellEvents.observable.subscribe((event:OmoEvent) => {
  if (event.type === "shell.authenticated") {
    window.fissionAuth = (<Authenticated>event).fissionAuth;
  }
  else if (event.type === "shell.gotProfile") {
    window.profile = (<GotProfile>event).profile;
  }
});

window.eventBroker = eventBroker;

window.dispatchShellEvent = (event) => {
  window.eventBroker.getTopic("omo", "shell").publish(event);
}

window.stateMachines = <any>stateMachine

const app = new App({
  target: document.body,
});

export default app;

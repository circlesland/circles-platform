import type { Observable } from "rxjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import App from "src/App.svelte";
import type { ProcessContext } from "src/libs/o-processes/processContext";
import { ProcessDefinition } from "src/libs/o-processes/processManifest";
import { EventBroker } from "./libs/o-os/eventBroker";
import { OmoEvent } from "./libs/o-events/omoEvent";
import * as webnative from "webnative";
import { stateMaschine } from "./libs/o-os/stateMaschine"

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
    }
    wn: any
  }
}

window.wn = webnative

window.mySafeAddress = localStorage.getItem("omo.safeAddress");

const eventBroker = new EventBroker();
eventBroker.createTopic("omo", "shell");

window.eventBroker = eventBroker;

window.dispatchShellEvent = (event) => {
  window.eventBroker.getTopic("omo", "shell").publish(event);
}

window.stateMachines = <any>stateMaschine

const app = new App({
  target: document.body,
});

export default app;

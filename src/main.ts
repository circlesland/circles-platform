import App from "./App.svelte";
import type { Observable } from "rxjs";
import type { StateMachine } from "xstate";
import { useMachine } from "xstate-svelte";
import { Subject } from "rxjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)
export interface Process {
  id: number;
  events: Observable<any>;
  sendEvent(event: any);
}

declare global {
  interface Window {
    stateMachines: {
      start: (definition: { context: any, machineDefinition: StateMachine<any, any, any> }) => Process,
      get: (id: number) => Process
    }
  }
}

window.stateMachines = {
  start: (definition: { context: any, machineDefinition: StateMachine<any, any, any> }) => {

    const { service, state, send } = useMachine(
      definition.machineDefinition,
      { context: definition.context });

    const processEvents = new Subject();

    service.onTransition((state1, event) => {
      console.log("service.onTransition", state1, event);
      processEvents.next(event);
    });
    service.onEvent(event => {
      console.log("service.onEvent", event);
      processEvents.next(event);
    });
    service.onChange(event => {
      console.log("service.onChange", event);
      processEvents.next(event);
    });
    service.onSend(event => {
      console.log("service.onSend", event);
      processEvents.next(event);
    });
    service.onDone(event => {
      console.log("service.onDone", event);
      processEvents.next(event);
    });
    service.onStop(() => {
      console.log("service.onStop");
    });

    const process: Process = {
      id: 0,
      events: processEvents,
      sendEvent: (event: any) => send(event)
    };

    service.start();

    return process;
  },
  get: (id: number) => {
    return null;
  }
};

const app = new App({
  target: document.body,
});

export default app;

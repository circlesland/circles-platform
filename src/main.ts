import App from "./App.svelte";
import type { Observable } from "rxjs";
import type { StateMachine } from "xstate";
import { useMachine } from "xstate-svelte";
import { Subject } from "rxjs";

import type { Account } from "./libs/o-circles-protocol/interfaces/account";
import { config } from "./libs/o-circles-protocol/config";
import { CirclesHub } from "./libs/o-circles-protocol/circles/circlesHub";
import type { ProcessContext } from "./processes/processContext";
import { GnosisSafeProxy } from "./libs/o-circles-protocol/safe/gnosisSafeProxy";
import { Person } from "./libs/o-circles-protocol/model/person";

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
      run: (definition: StateMachine<any, any, any>) => Process,
      get: (id: number) => Process
    }
  }
}

function getServiceContext(): ProcessContext {
  const safeAddress = localStorage.getItem("omo.safeAddress");
  const account: Account = {
    privateKey: localStorage.getItem("omo.privateKey"),
    address: localStorage.getItem("omo.address"),
  };
  const web3 = config.getCurrent().web3();
  const circlesHub = new CirclesHub(web3, config.getCurrent().HUB_ADDRESS);
  const processContext: ProcessContext = {
    safe: new GnosisSafeProxy(web3, account.address, safeAddress),
    account: account,
    person: new Person(circlesHub, safeAddress)
  };
  return processContext;
}

window.stateMachines = {
  run: (definition: StateMachine<any, any, any>) => {

    const { service, state, send } = useMachine(
      definition,
      { context: getServiceContext() });

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

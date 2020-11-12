import type { Observable } from "rxjs";
import { State } from "xstate";
import { useMachine } from "xstate-svelte";
import { Subject } from "rxjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import App from "src/App.svelte";
import { Account } from "src/libs/o-circles-protocol/interfaces/account";
import { config } from "src/libs/o-circles-protocol/config";
import { CirclesHub } from "src/libs/o-circles-protocol/circles/circlesHub";
import { ProcessContext } from "src/libs/o-processes/processContext";
import { GnosisSafeProxy } from "src/libs/o-circles-protocol/safe/gnosisSafeProxy";
import { Person } from "src/libs/o-circles-protocol/model/person";
import { ProcessDefinition } from "src/libs/o-processes/processManifest";
import { ProcessEvent } from "src/libs/o-processes/processEvent";

dayjs.extend(relativeTime)

export interface Process {
  id: number;
  events: Observable<any>;
  sendEvent(event: any);
}

declare global {
  interface Window {
    stateMachines: {
      run: (definition: ProcessDefinition) => Process
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
    person: new Person(circlesHub, safeAddress),
    other: {}
  };
  return processContext;
}

window.stateMachines = {
  run: (definition: ProcessDefinition) => {

    const { service, state, send } = useMachine(
      definition.stateMachine,
      { context: getServiceContext() });

    const processEvents = new Subject<{
      stopped: boolean,
      currentState?: State<any, any, any>,
      previousState?: State<any, any, any>,
      event?: ProcessEvent
    }>();

    service.onTransition((state1, event) => {
      processEvents.next({
        stopped: false,
        currentState: state1,
        previousState: state1.history,
        event: event
      });
    });
    service.onStop(() => {
      processEvents.next({
        stopped: true
      });
    });

    const process: Process = {
      id: 0,
      events: processEvents,
      sendEvent: (event: any) => send(event)
    };

    service.start();

    return process;
  }
};

const app = new App({
  target: document.body,
});

export default app;

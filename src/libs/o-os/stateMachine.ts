import {BehaviorSubject, Subject} from "rxjs";
import { Process } from "src/main";
import { State } from "xstate";
import { useMachine } from "xstate-svelte";
import { ProcessDefinition } from "../o-processes/processManifest";

import type { Account } from "src/libs/o-circles-protocol/interfaces/account";
import { config } from "src/libs/o-circles-protocol/config";
import { CirclesHub } from "src/libs/o-circles-protocol/circles/circlesHub";
import { GnosisSafeProxy } from "src/libs/o-circles-protocol/safe/gnosisSafeProxy";
import { Person } from "src/libs/o-circles-protocol/model/person";
import {ProcessContext} from "../o-processes/interfaces/processContext";
import {ProcessEnvironment} from "../o-processes/interfaces/processEnvironment";
import {ProcessEvent} from "../o-processes/interfaces/processEvent";
import {Nop} from "../o-processes/events/nop";

export async function getServiceContext(): Promise<ProcessContext> {
    const safeAddress = (await window.o.safe())?.address;
    const account: Account = {
        privateKey: localStorage.getItem("omo.privateKey"),
        address: localStorage.getItem("omo.address"),
    };
    const web3 = config.getCurrent().web3();
    const circlesHub = new CirclesHub(web3, config.getCurrent().HUB_ADDRESS);
    const environment: ProcessEnvironment = {
        safe: (!account.address || !safeAddress) ? null : new GnosisSafeProxy(web3, account.address, safeAddress),
        account: account,
        person: !safeAddress ? null : new Person(circlesHub, safeAddress),
        fissionAuth: window.o.fissionAuth
    };

    return <ProcessContext> {
      environment,
      data:{}
    };
}

export const stateMachine = {
    _current: null,
    current(): Process {
        return this._current;
    },
    cancel() {
        this._current = null;
    },
    async run<TContext>(definition: ProcessDefinition, contextModifier?: (processContext: ProcessContext) => TContext) {
        const { service, state, send } = useMachine(
            definition.stateMachine(),
            {
                context: contextModifier
                    ? contextModifier(await getServiceContext())
                    : await getServiceContext()
            });

        const processEvents = new BehaviorSubject<ProcessEvent>({
          stopped: false,
          currentState: null,
          previousState: null,
          event: new Nop()
        });

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
            this._current = null;
        });

        const process: Process = {
            id: 0,
            events: processEvents,
            sendEvent: (event: any) => send(event)
        };

        service.start();

        this._current = process;

        return process;
    }
};

import { Subject } from "rxjs";
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

function getServiceContext(): ProcessContext {
    const safeAddress = localStorage.getItem("omo.safeAddress");
    const account: Account = {
        privateKey: localStorage.getItem("omo.privateKey"),
        address: localStorage.getItem("omo.address"),
    };
    const web3 = config.getCurrent().web3();
    const circlesHub = new CirclesHub(web3, config.getCurrent().HUB_ADDRESS);
    const environment: ProcessEnvironment = {
        safe: !account.address ? null : new GnosisSafeProxy(web3, account.address, safeAddress),
        account: account,
        person: !safeAddress ? null : new Person(circlesHub, safeAddress)
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
    run<TContext>(definition: ProcessDefinition, contextModifier?: (processContext: ProcessContext) => TContext) {
        const { service, state, send } = useMachine(
            definition.stateMachine(),
            {
                context: contextModifier
                    ? contextModifier(getServiceContext())
                    : getServiceContext()
            });

        const processEvents = new Subject<ProcessEvent>();

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

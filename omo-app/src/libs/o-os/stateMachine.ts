import {Subject} from "rxjs";
import {useMachine} from "xstate-svelte";
import {ProcessDefinition} from "../o-processes/processManifest";
import {ProcessContext} from "../o-processes/interfaces/processContext";
import {ProcessEvent} from "../o-processes/interfaces/processEvent";
import {Process} from "../o-processes/interfaces/process";
import {getProcessContext} from "./o";
import {ShellEvent} from "../o-processes/events/shellEvent";

export const stateMachine = {
  _current: null,
  current(): Process
  {
    return this._current;
  },
  cancel()
  {
    this._current = null;
  },
  async run<TContext>(definition: ProcessDefinition, contextModifier?: (processContext: ProcessContext) => Promise<TContext>)
  {
    window.o.logger.log("run", definition.name);
    const {service, state, send} = useMachine(
      (<any>definition).stateMachine(),
      {
        context: contextModifier
          ? await contextModifier(await getProcessContext())
          : await getProcessContext()
      });

    const processEvents = new Subject<ProcessEvent>();

    service.onTransition((state1, event) =>
    {
      window.o.logger.log(event);
      /*
      if (event.type === "process.shellEvent")
      {
        window.o.publishEvent((<ShellEvent>event).payload);
      }
       */

      processEvents.next(<any>{
        stopped: false,
        currentState: state1,
        previousState: state1.history,
        event: event
      });
    });
    service.onStop(() =>
    {
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

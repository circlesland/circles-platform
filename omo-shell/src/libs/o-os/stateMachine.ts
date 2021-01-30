import {useMachine} from "xstate-svelte";
import {getProcessContext} from "./o";
import {OmoSubject} from "omo-quirks/dist/OmoSubject";
import LoadingIndicator from "../o-views/atoms/LoadingIndicator.svelte"
import Success from "../o-views/atoms/Success.svelte"
import Error from "../o-views/atoms/Error.svelte"
import {Process} from "omo-process/dist/interfaces/process";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";
import {ProcessContext} from "omo-process/dist/interfaces/processContext";
import {ProcessEvent} from "omo-process/dist/interfaces/processEvent";

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
      (<any>definition).stateMachine(LoadingIndicator, Success, Error),
      {
        context: contextModifier
          ? await contextModifier(await getProcessContext())
          : await getProcessContext()
      });

    const processEvents = new OmoSubject<ProcessEvent>();

    service.onTransition((state1, event) =>
    {
      if (event.type == 'error.platform')
      {
        window.o.logger.log(`An error occurred during the execution of a workflow:`, event);
      }

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

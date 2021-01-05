var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Subject } from "rxjs";
import { useMachine } from "xstate-svelte";
import { getProcessContext } from "./o";
export const stateMachine = {
    _current: null,
    current() {
        return this._current;
    },
    cancel() {
        this._current = null;
    },
    run(definition, contextModifier) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("run", definition.name);
            const { service, state, send } = useMachine(definition.stateMachine(), {
                context: contextModifier
                    ? yield contextModifier(yield getProcessContext())
                    : yield getProcessContext()
            });
            const processEvents = new Subject();
            service.onTransition((state1, event) => {
                console.log(event);
                /*
                if (event.type === "process.shellEvent")
                {
                  window.o.publishEvent((<ShellEvent>event).payload);
                }
                 */
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
            const process = {
                id: 0,
                events: processEvents,
                sendEvent: (event) => send(event)
            };
            service.start();
            this._current = process;
            return process;
        });
    }
};

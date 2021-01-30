import { State } from "xstate";
import { OmoEvent } from "omo-events/dist/omoEvent";

export interface ProcessEvent {
  stopped: boolean;
  currentState?: State<any, OmoEvent, any>;
  previousState?: State<any, OmoEvent, any>;
  event?: OmoEvent;
}

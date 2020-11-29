import {OmoEventTypes} from "../../o-events/eventTypes";
import {OmoEvent} from "../../o-events/omoEvent";

export class ShellEvent implements OmoEvent {
  type: OmoEventTypes = "process.shellEvent";
  payload: OmoEvent;
}

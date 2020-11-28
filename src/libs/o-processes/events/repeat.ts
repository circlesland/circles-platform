import {OmoEvent} from "../../o-events/omoEvent";
import {OmoEventTypes} from "../../o-events/eventTypes";

/**
 * Can be used to ask a process to repeat its last sent event.
 * This is useful to re-create the UI of an already running process e.g.
 * when a Prompt dialog was closed but should now be continued.
 */
export class Repeat implements OmoEvent {
  type: OmoEventTypes = "process.repeat";
}

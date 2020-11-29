import {OmoEvent} from "../../o-events/omoEvent";
import {OmoEventTypes} from "../../o-events/eventTypes";

export class Nop implements OmoEvent {
  type: OmoEventTypes = "process.nop";
}

import {OmoEventTypes} from "../../o-events/eventTypes";
import {OmoEvent} from "../../o-events/omoEvent";

export class Cancel implements OmoEvent {
  type: OmoEventTypes = "process.cancel";
}

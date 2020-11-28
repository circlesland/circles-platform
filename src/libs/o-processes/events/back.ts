import {OmoEvent} from "../../o-events/omoEvent";
import {OmoEventTypes} from "../../o-events/eventTypes";

export class Back implements OmoEvent {
  type: OmoEventTypes = "process.back";
}

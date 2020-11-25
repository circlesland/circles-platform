import {OmoEvent} from "./omoEvent";
import {OmoEventTypes} from "./eventTypes";

export class Cancel implements OmoEvent {
  type: OmoEventTypes = "omo.cancel";
}

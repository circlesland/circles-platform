import {OmoEvent} from "./omoEvent";
import {OmoEventTypes} from "./eventTypes";

export class Trigger implements OmoEvent {
  type: OmoEventTypes = "omo.trigger";
}

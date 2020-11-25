import {OmoEvent} from "./omoEvent";
import {OmoEventTypes} from "./eventTypes";

export class Stop implements OmoEvent {
  type: OmoEventTypes = "omo.stop";
}

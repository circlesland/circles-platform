import {OmoEvent} from "./omoEvent";
import {OmoEventTypes} from "./eventTypes";

export class Stopped implements OmoEvent {
  type: OmoEventTypes = "omo.stopped";
}

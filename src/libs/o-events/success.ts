import {OmoEvent} from "./omoEvent";
import {OmoEventTypes} from "./eventTypes";

export class Success implements OmoEvent {
  type: OmoEventTypes = "omo.success";
}

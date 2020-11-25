import {OmoEvent} from "./omoEvent";
import {OmoEventTypes} from "./eventTypes";

export class Back implements OmoEvent {
  type: OmoEventTypes = "omo.back";
}

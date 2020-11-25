import {OmoEvent} from "./omoEvent";
import {OmoEventTypes} from "./eventTypes";

export class Error implements OmoEvent {
  type: OmoEventTypes = "omo.error";
}

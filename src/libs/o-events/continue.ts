import {OmoEvent} from "./omoEvent";
import {OmoEventTypes} from "./eventTypes";

export class Continue implements OmoEvent {
  type: OmoEventTypes = "omo.continue";
}

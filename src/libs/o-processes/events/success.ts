import {OmoEventTypes} from "../../o-events/eventTypes";
import {OmoEvent} from "../../o-events/omoEvent";

export class Success implements OmoEvent {
  type: OmoEventTypes = "process.success";
  result: any;
}

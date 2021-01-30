import { OmoEvent } from "omo-events/dist/omoEvent";
import { OmoEventTypes } from "omo-events/dist/eventTypes";

export class Success implements OmoEvent {
  type: OmoEventTypes = "process.success";
  result: any;
}

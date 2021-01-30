import { OmoEvent } from "omo-events/dist/omoEvent";
import { OmoEventTypes } from "omo-events/dist/eventTypes";

export class Back implements OmoEvent {
  type: OmoEventTypes = "process.back";
}

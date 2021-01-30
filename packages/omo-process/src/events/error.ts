import { OmoEvent } from "omo-events/dist/omoEvent";
import { OmoEventTypes } from "omo-events/dist/eventTypes";

export class Error implements OmoEvent {
  type: OmoEventTypes = "process.error";
  error: any;
}

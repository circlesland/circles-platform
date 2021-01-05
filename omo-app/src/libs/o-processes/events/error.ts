import { OmoEventTypes } from "../../o-events/eventTypes";
import { OmoEvent } from "../../o-events/omoEvent";

export class Error implements OmoEvent {
  type: OmoEventTypes = "process.error";
  error: any;
}

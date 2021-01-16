import { OmoEvent } from "omo-events/dist/omoEvent";
import { OmoEventTypes } from "omo-events/dist/eventTypes";

export class Cancel implements OmoEvent {
  type: OmoEventTypes = "process.cancel";
}

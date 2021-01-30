import { OmoEvent } from "omo-events/dist/omoEvent";
import { OmoEventTypes } from "omo-events/dist/eventTypes";

export class Nop implements OmoEvent {
  type: OmoEventTypes = "process.nop";
}

import { OmoEvent } from "omo-events/dist/omoEvent";
import { OmoEventTypes } from "omo-events/dist/eventTypes";

export class ShellEvent implements OmoEvent {
  type: OmoEventTypes = "process.shellEvent";
  payload: OmoEvent;

  constructor(payload:OmoEvent)
  {
    this.payload = payload;
  }
}

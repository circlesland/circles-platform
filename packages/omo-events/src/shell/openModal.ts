import { OmoEvent } from "../omoEvent";
import { OmoEventTypes } from "../eventTypes";

export class OpenModal implements OmoEvent {
  type: OmoEventTypes = "shell.openModal";
}

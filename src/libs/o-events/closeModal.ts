import { OmoEvent } from "./omoEvent";
import { OmoEventTypes } from "./eventTypes";

export class CloseModal implements OmoEvent {
  type: OmoEventTypes = "shell.closeModal";
}

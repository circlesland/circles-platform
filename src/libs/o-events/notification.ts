import {OmoEvent} from "./omoEvent";
import {OmoEventTypes} from "./eventTypes";

export class Notification implements OmoEvent {
  type: OmoEventTypes = "omo.notification";
  message: string;
}

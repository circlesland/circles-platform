import {OmoEvent} from "../../../libs/o-events/omoEvent";
import {OmoEventTypes} from "../../../libs/o-events/eventTypes";

export class GotSafe implements OmoEvent {
  type: OmoEventTypes = "shell.gotSafe";
}

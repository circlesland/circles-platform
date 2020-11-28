import {OmoEventTypes} from "../../o-events/eventTypes";
import {OmoEvent} from "../../o-events/omoEvent";
import {ProcessArtifact} from "../interfaces/processArtifact";

/**
 * Can be used as a generic trigger event or as response to a 'Prompt'.
 */
export class Continue implements OmoEvent {
  type: OmoEventTypes = "process.continue";
  data?: {
    [key: string]: ProcessArtifact
  }
}

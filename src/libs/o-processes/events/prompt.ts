import {OmoEventTypes} from "../../o-events/eventTypes";
import {OmoEvent} from "../../o-events/omoEvent";
import {ProcessArtifact} from "../interfaces/processArtifact";
import type { SvelteComponent } from "svelte"

/**
 * Can be used to ask for user input or to display status information.
 */
export class Prompt implements OmoEvent {
  type: OmoEventTypes = "process.prompt";
  /**
   * The title.
   */
  title:string;
  /**
   * Can contain a svelte component which is displayed as banner
   * above of the inputs.
   * If the component exports a 'data' property, the 'ProcessArtifact' values
   * of this event's 'data' property will be set on the components 'data' property.
   */
  banner?: SvelteComponent;
  data: {
    [key: string]: ProcessArtifact
  };

  /**
   * If set, the value of this property overrides the default 'Next' text of the next-button.
   */
  nextButtonTitle?:string;
}

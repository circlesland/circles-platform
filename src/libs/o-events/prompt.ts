import {OmoEvent} from "./omoEvent";
import {OmoEventTypes} from "./eventTypes";

export class PromptField {
  /**
   * If set, the values of this PromptField will be persisted in the ProcessContext
   */
  key?: string;
  type: string;
  required?:boolean;
  readonly?:boolean;
  label?:string;
  /**
   * Contains settings and properties for the loaded components.
   */
  props: any;
}

export class Prompt implements OmoEvent {
  type: OmoEventTypes = "omo.prompt";
  fields: PromptField[];
}

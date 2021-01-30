import {ProcessArtifactType} from "./processArtifactType";

/**
 * Is used to describe a requested value in a 'Prompt' event and to return
 * the requested value in a 'Continue' event.
 */
export interface ProcessArtifact {
  /**
   * The property name of this artifact on the context's 'data' property.
   */
  key: string,
  /**
   * The type of the artifact.
   * Each type is associated with a corresponding UI-editor.
   */
  type: ProcessArtifactType,
  /**
   * Can be used when 'type' == 'choice' and contains the possible options.
   * The selected option is stored in the 'value' property.
   */
  choices?: any[],
  /**
   * If the artifact is optional it doesn't need to be included in a 'Continue'
   * event that responds to a 'Prompt' in order to proceed to the next state.
   */
  isOptional?: boolean,
  /**
   * If users can edit the value of this artifact.
   */
  isReadonly?: boolean,
  /**
   * If an artifact is invalid and non-optional, the process cannot proceed.
   */
  isValid?:boolean,

  enableAutocomplete?:boolean,
  /**
   * If set, the value is used as <label> for the rendered input.
   */
  label?: string,
  /**
   * A placeholder value for the ui.
   */
  placeholder?:string,
  /**
   * When this object is used in a Prompt/Continue scenario,
   * this property must be set to 'true' if the 'value' of this
   * object was changed between Prompt and Continue.
   */
  changed?:boolean,

  max?:any;
  /**
   * Either the initial, edited or no value.
   */
  value?: any
}

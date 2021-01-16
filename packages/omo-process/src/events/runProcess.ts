import { OmoEvent } from "omo-events/dist/omoEvent";
import { OmoEventTypes } from "omo-events/dist/eventTypes";
import { ProcessDefinition } from "../interfaces/processManifest";
import { ProcessContext } from "../interfaces/processContext";

export class RunProcess implements OmoEvent {
  type: OmoEventTypes = "shell.runProcess";

  readonly definition: ProcessDefinition;
  readonly contextModifier?: (processContext: ProcessContext) => Promise<ProcessContext>;

  constructor(definition: ProcessDefinition, contextModifier?: (processContext: ProcessContext) => Promise<ProcessContext>) {
    this.definition = definition;
    this.contextModifier = contextModifier;
  }
}

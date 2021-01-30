import { OmoEvent } from "omo-events/dist/omoEvent";
import { OmoEventTypes } from "omo-events/dist/eventTypes";
import { ProcessDefinition } from "../interfaces/processManifest";
import { ProcessContext } from "../interfaces/processContext";

export class RunProcess<TContext extends ProcessContext> implements OmoEvent {
  type: OmoEventTypes = "shell.runProcess";

  readonly definition: ProcessDefinition;
  readonly contextModifier?: (processContext: TContext) => Promise<TContext>;

  constructor(definition: ProcessDefinition, contextModifier?: (processContext: TContext) => Promise<TContext>) {
    this.definition = definition;
    this.contextModifier = contextModifier;
  }
}

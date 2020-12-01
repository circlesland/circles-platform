import {OmoEvent} from "./omoEvent";
import {ProcessDefinition} from "../o-processes/processManifest";
import {OmoEventTypes} from "./eventTypes";
import {ProcessContext} from "../o-processes/interfaces/processContext";

export class RunProcess implements OmoEvent {
    type: OmoEventTypes = "shell.runProcess";

    readonly definition: ProcessDefinition;
    readonly contextModifier?:(processContext:ProcessContext)=>Promise<ProcessContext>;

    constructor(definition: ProcessDefinition, contextModifier?:(processContext:ProcessContext)=>Promise<ProcessContext>)
    {
        this.definition = definition;
        this.contextModifier = contextModifier;
    }
}

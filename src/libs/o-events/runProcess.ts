import {OmoEvent} from "./omoEvent";
import {ProcessDefinition} from "../o-processes/processManifest";
import {ProcessContext} from "../o-processes/processContext";
import {OmoEventTypes} from "./eventTypes";

export class RunProcess implements OmoEvent {
    type: OmoEventTypes = "runProcess";

    readonly definition: ProcessDefinition;
    readonly contextModifier?:(processContext:ProcessContext)=>ProcessContext;

    constructor(definition: ProcessDefinition, contextModifier?:(processContext:ProcessContext)=>ProcessContext)
    {
        this.definition = definition;
        this.contextModifier = contextModifier;
    }
}

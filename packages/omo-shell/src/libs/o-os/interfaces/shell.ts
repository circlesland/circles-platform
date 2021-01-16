import {Subject} from "rxjs";
import {Logger} from "omo-utils/dist/logger";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {Process} from "omo-process/dist/process";
import {ProcessDefinition} from "omo-process/dist/processManifest";
import {ProcessContext} from "omo-process/dist/processContext";

export interface Shell {
  lastError?: any;
  redirectTo?: string;
  events?: Subject<OmoEvent>,
  publishEvent?: (event: OmoEvent) => void,
  logger: Logger,
  stateMachines: {
    current(): Process | null,
    cancel(),
    run: (definition: ProcessDefinition, contextModifier?: (processContext: ProcessContext) => Promise<ProcessContext>) => Process
  }
}

import {Logger} from "omo-utils/dist/logger";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {Process} from "omo-process/dist/process";
import {ProcessDefinition} from "omo-process/dist/processManifest";
import {ProcessContext} from "omo-process/dist/processContext";
import {OmoSubject} from "omo-quirks/dist/OmoSubject";

export interface Shell {
  lastError?: any;
  redirectTo?: string;
  events?: OmoSubject<OmoEvent>,
  publishEvent?: (event: OmoEvent) => void,
  logger: Logger,
  stateMachines: {
    current(): Process | null,
    cancel(),
    run: (definition: ProcessDefinition, contextModifier?: (processContext: ProcessContext) => Promise<ProcessContext>) => Process
  }
}

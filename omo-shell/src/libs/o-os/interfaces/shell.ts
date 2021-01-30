import {Logger} from "omo-utils/dist/logger";
import {OmoEvent} from "omo-events/dist/omoEvent";
import {OmoSubject} from "omo-quirks/dist/OmoSubject";
import {Process} from "omo-process/dist/interfaces/process";
import {ProcessDefinition} from "omo-process/dist/interfaces/processManifest";
import {ProcessContext} from "omo-process/dist/interfaces/processContext";

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

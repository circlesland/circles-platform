import {Subject} from "rxjs";
import {OmoEvent} from "../../o-events/omoEvent";
import {Process} from "../../o-processes/interfaces/process";
import {ProcessDefinition} from "../../o-processes/processManifest";
import {ProcessContext} from "../../o-processes/interfaces/processContext";
import {Logger} from "omo-utils/dist/logger";

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
  },
  wn: any
}

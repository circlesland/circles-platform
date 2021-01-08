import {Observable} from "rxjs";
import {OmoEvent} from "../../o-events/omoEvent";
import {Process} from "../../o-processes/interfaces/process";
import {ProcessDefinition} from "../../o-processes/processManifest";
import {ProcessContext} from "../../o-processes/interfaces/processContext";
import {SessionLog} from "../../o-fission/entities/sessionLog";

export type Logger = {
  name: string,
  parent: any,
  log: (...args: unknown[]) => void,
  newLogger: (name:string) => Logger
}

export interface Shell {
  lastError?: any;
  redirectTo?: string;
  events?: Observable<any>,
  publishEvent?: (event: OmoEvent) => void,
  logger: Logger,
  stateMachines: {
    current(): Process | null,
    cancel(),
    run: (definition: ProcessDefinition, contextModifier?: (processContext: ProcessContext) => Promise<ProcessContext>) => Process
  },
  wn: any
}

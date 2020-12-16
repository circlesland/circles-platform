import {Observable} from "rxjs";
import {OmoEvent} from "../../o-events/omoEvent";
import {Process} from "../../o-processes/interfaces/process";
import {ProcessDefinition} from "../../o-processes/processManifest";
import {ProcessContext} from "../../o-processes/interfaces/processContext";
import {ProcessEnvironment} from "../../o-processes/interfaces/processEnvironment";
import {FissionDrive} from "../../o-fission/fissionDrive";

export interface Shell {
  fission?: FissionDrive,
  events: Observable<any>,
  publishEvent: (event: OmoEvent) => void,
  stateMachines: {
    current(): Process | null,
    cancel(),
    run: (definition: ProcessDefinition, contextModifier?: (processContext: ProcessContext) => Promise<ProcessContext>) => Process
  },
  getEnvironment: () => Promise<ProcessEnvironment>,
  wn: any
}

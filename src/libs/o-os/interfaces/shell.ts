import {AuthSucceeded, Continuation} from "webnative";
import {Observable} from "rxjs";
import {OmoEvent} from "../../o-events/omoEvent";
import {Process} from "../../o-processes/interfaces/process";
import {ProcessDefinition} from "../../o-processes/processManifest";
import {ProcessContext} from "../../o-processes/interfaces/processContext";
import {SafeReference} from "../../../dapps/safe/interfaces/SafeReference";
import {Profile} from "../../../dapps/odentity/interfaces/profile";
import {ProcessEnvironment} from "../../o-processes/interfaces/processEnvironment";

export interface Shell {
  fissionAuth: AuthSucceeded|Continuation,
  events: Observable<any>,
  publishEvent: (event: OmoEvent) => void,
  stateMachines: {
    current(): Process | null,
    cancel(),
    run: (definition: ProcessDefinition, contextModifier?: (processContext: ProcessContext) => ProcessContext) => Process
  },
  getEnvironment: () => Promise<ProcessEnvironment>,
  safe: () => Promise<SafeReference>
  profile: () => Promise<Profile>,
  wn: any
}

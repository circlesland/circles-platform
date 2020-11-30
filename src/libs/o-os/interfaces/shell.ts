import {AuthSucceeded, Continuation} from "webnative";
import {Observable} from "rxjs";
import {OmoEvent} from "../../o-events/omoEvent";
import {Process} from "../../o-processes/interfaces/process";
import {ProcessDefinition} from "../../o-processes/processManifest";
import {ProcessContext} from "../../o-processes/interfaces/processContext";
import {SafeReference} from "../../../dapps/safe/interfaces/SafeReference";
import {Profile} from "../../../dapps/odentity/interfaces/profile";

export interface Shell {
  fissionAuth: AuthSucceeded|Continuation,
  shellEvents: Observable<any>,
  dispatchShellEvent: (event: OmoEvent) => void,
  stateMachines: {
    current(): Process | null,
    cancel(),
    run: (definition: ProcessDefinition, contextModifier?: (processContext: ProcessContext) => ProcessContext) => Process
  },
  safe: () => Promise<SafeReference>
  profile: () => Promise<Profile>,
  wn: any
}

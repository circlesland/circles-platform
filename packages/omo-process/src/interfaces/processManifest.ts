import { StateMachine } from "xstate";
import {ProcessContext} from "./processContext";
import {OmoEvent} from "omo-events/dist/omoEvent";

export interface ProcessManifest {
  id?: number;
  name: string;
}

export interface ProcessDefinition extends ProcessManifest {
  stateMachine: ((progressView:any, successView:any, errorView:any) => StateMachine<ProcessContext, any, OmoEvent>) | ((args: any) => StateMachine<ProcessContext, any, OmoEvent>);
}

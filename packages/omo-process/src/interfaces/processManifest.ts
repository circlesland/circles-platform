import { StateMachine } from "xstate";
import {ProcessContext} from "./processContext";
import {OmoEvent} from "omo-events/dist/omoEvent";

export interface ProcessManifest {
  id?: number;
  name: string;
}

export interface ProcessDefinition<TIn, TOut> extends ProcessManifest {
  stateMachine: ((progressView:any, successView:any, errorView:any) =>
      StateMachine<ProcessContext, any, any>) | ((args: any) => StateMachine<ProcessContext, any, any>);
}

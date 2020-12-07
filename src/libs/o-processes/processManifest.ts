import { StateMachine } from "xstate";

export interface ProcessManifest {
  id?: number;
  name: string;
}

export interface ProcessDefinition extends ProcessManifest {
  stateMachine: (() => StateMachine<any, any, any>) | ((args: any) => StateMachine<any, any, any>);
}

import { assign, createMachine } from "xstate";
import { useMachine } from "xstate-svelte";
export interface Transaction {
    name: string
}
export interface AppContext {
    view: string
}

export type AppEvent =
    | { type: "NAVIGATE"; path?: string; params?: any; direction: "BACK" | "HOME" | "FORWARD" }
    | { type: "EDIT" };


const buildContext = (context?: AppContext, newView?: string): AppContext => ({
    view: newView ?? context?.view
});

export const stateMachine = createMachine<AppContext, AppEvent>({
    initial: "idle",
    context: buildContext(),
    states: {
    }
});

export const { state, send } = useMachine(stateMachine);

import { assign, createMachine } from "xstate";
import { useMachine } from "xstate-svelte";

import type Component from "svelte/types/compiler/compile/Component";

export interface Transaction {
    name: string
}
export interface AppContext {
    view: string
}

export type AppEvent =
    | { type: "NAVIGATE"; path?:string; params?:any; direction: "BACK" | "HOME" | "FORWARD" }
    | { type: "EDIT" };


const buildContext = (context?:AppContext, newView?:string): AppContext => ({
    view: newView ?? context?.view
});

export const stateMachine = createMachine<AppContext, AppEvent>({
    initial: "idle",
    context: buildContext(),
    states: {
        idle: {
            on: {
                NAVIGATE: [{
                    cond: ((context, event) => event.path == "/app"),
                    target: "app"
                },{
                    cond: ((context, event) => event.path == "/about"),
                    target: "about"
                }]
            }
        },
        app: {
            entry: assign((ctx, evt) =>
            {
                console.log("App")
                return buildContext(ctx, "AppPage");
            })
        },
        about: {
            entry: assign((ctx, evt) =>
            {
                console.log("About")
                return buildContext(ctx, "About");
            }),
            on: {
                NAVIGATE: "idle"
            }
        }
    }
});

export const { state, send } = useMachine(stateMachine);

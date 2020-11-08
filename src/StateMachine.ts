import { assign, createMachine } from "xstate";
import { useMachine } from "xstate-svelte";

import {
    addDays,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    startOfMonth,
    startOfWeek,
} from "date-fns";

import type Component from "svelte/types/compiler/compile/Component";

export interface Transaction {
    name: string
}
export interface AppContext {
    currentDate: Date,
    currentMonth: Date[],
    transactions: Transaction[],
    currentComponent: Component
}

export type AppEvent =
    | { type: "NAVIGATE"; path?:string; params?:any; direction: "BACK" | "HOME" | "FORWARD" }
    | { type: "EDIT" };


const buildContext = (date: Date, transactions: Transaction[]): AppContext => ({
    currentDate: date,
    currentMonth: eachDayOfInterval({
        start: startOfWeek(startOfMonth(date)),
        end: endOfWeek(endOfMonth(date)),
    }),
    transactions,
    currentComponent: null
});

export const stateMachine = createMachine<AppContext, AppEvent>({
    initial: "idle",
    context: buildContext(new Date(), []),
    states: {
        idle: {
            on: {
                NAVIGATE: [{
                    cond: ((context, event) => event.path == "/#!/app"),
                    target: "app"
                },{
                    cond: ((context, event) => event.path == "/#!/about"),
                    target: "about"
                }]
            }
        },
        app: {
            entry:() => {
                console.log("In APP!");
            }
        },
        about: {
            on: {
                NAVIGATE: "idle"
            }
        }
    }
});

export const { state, send } = useMachine(stateMachine);

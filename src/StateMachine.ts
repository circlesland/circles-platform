import { assign, createMachine } from "xstate";
import { useMachine } from "xstate-svelte";
import dayjs from "dayjs";

import {
    addDays,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    startOfMonth,
    startOfWeek,
} from "date-fns";

export interface Transaction {
    name: string
}
export interface AppContext {
    currentDate: Date,
    currentMonth: Date[],
    transactions: Transaction[]
}

export type AppEvent =
    | { type: "NAVIGATE"; direction: "BACK" | "HOME" | "FORWARD" }
    | { type: "EDIT" };


const buildContext = (date: Date, transactions: Transaction[]): AppContext => ({
    currentDate: date,
    currentMonth: eachDayOfInterval({
        start: startOfWeek(startOfMonth(date)),
        end: endOfWeek(endOfMonth(date)),
    }),
    transactions
});

export const stateMachine = createMachine<AppContext, AppEvent>({
    initial: "idle",
    context: buildContext(new Date(), []),
    states: {
        idle: {
            on: {
                NAVIGATE: {
                    actions: assign((ctx, evt) => {
                        switch (evt.direction) {
                            case "BACK":
                                return buildContext(
                                    addDays(ctx.currentMonth[0], -1),
                                    ctx.transactions
                                )
                            case "HOME":
                                return buildContext(
                                    new Date(),
                                    ctx.transactions
                                )
                            case "FORWARD":
                                return buildContext(
                                    addDays(ctx.currentMonth[ctx.currentMonth.length - 1], 1),
                                    ctx.transactions
                                )
                        }
                    })
                },
                EDIT: "edit"
            }
        },
        edit: {}
    }
});

export const { state, send } = useMachine(stateMachine);

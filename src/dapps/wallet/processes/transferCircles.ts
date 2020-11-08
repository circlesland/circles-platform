import {createMachine} from "xstate";
import {useMachine} from "xstate-svelte";

export type TransferCirclesEvent =
    | { type: "NAVIGATE" }
    | { type: "EDIT" };

export interface TransferCirclesContext {
    view: string
}
const buildContext = (context?: TransferCirclesContext, newView?: string): TransferCirclesContext => ({
    view: newView ?? context?.view
});
const machineDefinition = createMachine<TransferCirclesContext, TransferCirclesEvent>({
    initial: "idle",
    context: buildContext(),
    states: {
    }
});

export const run = (initialEvent?:TransferCirclesEvent) => {
    const machine = useMachine(machineDefinition);
    if (initialEvent)
        machine.send(initialEvent);
}

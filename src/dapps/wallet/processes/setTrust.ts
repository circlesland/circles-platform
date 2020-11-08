import {createMachine} from "xstate";
import {useMachine} from "xstate-svelte";

export type SetTrustEvent =
    | { type: "NAVIGATE" }
    | { type: "EDIT" };

export interface SetTrustContext {
    view: string
}
const buildContext = (context?: SetTrustContext, newView?: string): SetTrustContext => ({
    view: newView ?? context?.view
});
const machineDefinition = createMachine<SetTrustContext, SetTrustEvent>({
    initial: "idle",
    context: buildContext(),
    states: {
    }
});

export const run = (initialEvent?:SetTrustEvent) => {
    const machine = useMachine(machineDefinition);
    if (initialEvent)
        machine.send(initialEvent);
}

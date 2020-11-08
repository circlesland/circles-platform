import {createMachine} from "xstate";
import {useMachine} from "xstate-svelte";

export type ConnectSafeEvent =
    | { type: "CONNECT_NEW" }
    | { type: "CONNECT_EXISTING" }
    | { type: "ACCOUNT_KEY" }
    | { type: "SAFE_ADDRESS" }
    | { type: "VALIDATE" };

export interface ConnectSafeContext {
    view: string
}
const buildContext = (context?: ConnectSafeContext, newView?: string): ConnectSafeContext => ({
    view: newView ?? context?.view
});
const machineDefinition = createMachine<ConnectSafeContext, ConnectSafeEvent>({
    initial: "idle",
    context: buildContext(),
    states: {
    }
});

export const run = (initialEvent?:ConnectSafeEvent) => {
    const machine = useMachine(machineDefinition);
    if (initialEvent)
        machine.send(initialEvent);
}

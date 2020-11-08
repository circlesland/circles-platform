<script lang="ts">
    import {createMachine} from "xstate";
    import type {AppContext, AppEvent} from "../StateMachine";

    const buildContext = (context?:AppContext, newView?:string): AppContext => ({
        view: newView ?? context?.view
    });

    const addTrust = createMachine<AppContext, AppEvent>({
        initial: "idle",
        context: buildContext(),
        states: {
        }
    });

    const transfer = createMachine<AppContext, AppEvent>({
        initial: "idle",
        context: buildContext(),
        states: {
        }
    });
</script>
Wallet

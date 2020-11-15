<script lang="ts">
    import {requestUbi} from "../processes/requestUbi/requestUbi";
    import {transferCircles} from "../processes/transferCircles/transferCircles";
    import {setTrust} from "../processes/setTrust/setTrust";
    import {connectSafe} from "../processes/connectSafe/connectSafe";
    import Process from "../../../libs/o-views/molecules/Process.svelte";
    import {ProcessDefinition} from "../../../libs/o-processes/processManifest";

    let process:ProcessDefinition;
</script>
{#if process}
    <Process definition={process}/>
{:else}
<div class="w-full p-4 space-y-2 border-t border-gray-300 rounded-t-xl">
    <div class="space-y-2">
        <div
                class="w-full p-2 font-bold text-center uppercase border-2 rounded bg-light-100 border-primary text-primary hover:bg-primary hover:text-white"
                on:click={() => process = requestUbi}>
            Get Universal basic income
        </div>
        <div class="flex space-x-2">
            <div
                    class="w-full p-2 text-center uppercase border-2 rounded bg-light-100 border-primary text-primary hover:bg-primary hover:text-white"
                    on:click={() => process = setTrust}>
                add friend
            </div>
        </div>
        <div class="flex space-x-2">
            <div
                    class="w-full p-2 font-bold text-center uppercase border-2 rounded bg-light-100 border-primary text-primary hover:bg-primary hover:text-white">
                Receive Money
            </div>
            <div
                    class="w-full p-2 font-bold text-center uppercase border-2 rounded bg-light-100 border-primary text-primary hover:bg-primary hover:text-white"
                    on:click={() => process = transferCircles}>
                Send Money
            </div>
        </div>
        <div class="flex space-x-2">
            <div
                    class="w-full p-2 font-bold text-center uppercase border-2 rounded bg-light-100 border-primary text-primary hover:bg-primary hover:text-white"
                    on:click={() => process = connectSafe}>
                Connect Safe
            </div>
        </div>
    </div>
</div>
{/if}

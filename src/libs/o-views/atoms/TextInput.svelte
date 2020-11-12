<script lang="ts">
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    let isValid = true;
    let text:string;

    $:{
        dispatch('value', {
            type: "text",
            data: text
        });
    }
</script>
{#if !isValid}
    Invalid value:<br/>
{/if}
<textarea bind:value={text}></textarea>

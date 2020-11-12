<script lang="ts">
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    let isValid = true;
    let line:string;

    $:{
        dispatch('value', {
            type: "string",
            data: line
        });
    }
</script>
{#if !isValid}
    Invalid value:<br/>
{/if}
<input placeholder="Bla bla bla .."
       type="string"
       bind:value={line} />

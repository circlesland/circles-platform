<script lang="ts">
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    let isValid = true;
    export let line:string;

    $:{
        dispatch('value', {
            type: "string",
            data: line
        });
    }
</script>
<input placeholder="Bla bla bla .."
       type="string"
       class:border={!isValid}
       class:border-red-500={!isValid}
       bind:value={line} />

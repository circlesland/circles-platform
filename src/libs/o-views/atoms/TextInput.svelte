<script lang="ts">
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    let isValid = true;
    export let text:string;

    $:{
        dispatch('value', {
            type: "text",
            data: text
        });
    }
</script>
<textarea
        class:border={!isValid}
        class:border-red-500={!isValid}
        bind:value={text}></textarea>

<script lang="ts">
    import {createEventDispatcher} from "svelte";

    let text:string = "0";

    const dispatch = createEventDispatcher();

    export let isValid = true;
    export let data:string = "";

    $:{
        if (text && text.length > 0) {
            isValid = true;
            try
            {
                data = text;
                dispatch('data', {
                    type: "string",
                    data: data
                });
            } catch (e) {
                isValid = false;
            }
        }
    }
</script>
<input type="text" bind:value={text} />

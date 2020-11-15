<script lang="ts">
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    let isValid = true;
    export let percentValue:string;

    $:{
        dispatch('value', {
            type: "percent",
            data: percentValue
        });
    }
</script>
<input placeholder="Bla bla bla .."
       type="number"
       min="0"
       max="100"
       class:border={!isValid}
       class:border-red-500={!isValid}
       bind:value={percentValue} />

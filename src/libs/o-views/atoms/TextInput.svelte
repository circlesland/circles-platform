<script lang="ts">
    let isValid = true;
    export let text:string;
    export let isReadonly: boolean = false;
</script>
<textarea
        readonly={isReadonly ? 'readonly' : ''}
        class:border={!isValid}
        class:border-red-500={!isValid}
        bind:value={text}></textarea>

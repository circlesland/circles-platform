<script lang="ts">
  let isValid = true;
  export let label: string;
  export let hexByteString: string = "";
  export let isReadonly: boolean = false;
</script>

<div class="w-full">
  <p class="mb-1 text-xs text-gray-700 uppercase">{label}</p>

  <input
    readonly={isReadonly ? 'readonly' : ''}
    class:border-2={!isValid}
    class:border-red-500={!isValid}
    placeholder="0x1234..."
    type="text"
    minlength="42"
    maxlength="42"
    bind:value={hexByteString}
    class="w-full p-2 mb-2 text-xl bg-transparent border border-gray-300 rounded text-primary" />
</div>

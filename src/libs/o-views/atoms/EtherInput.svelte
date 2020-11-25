<script lang="ts">
  let isValid = false;

  export let ethValueString: string = "";
  export let label: string = "Label";
  export let isReadonly: boolean = false;
</script>

<div class="w-full">
  <p class="mb-1 text-xs text-gray-700 uppercase">{label}</p>
  <input
    readonly={isReadonly ? 'readonly' : ''}
    placeholder="0.0"
    type="number"
    class:border={!isValid}
    class:border-red-500={!isValid}
    bind:value={ethValueString}
    class="w-full px-2 mb-2 text-6xl bg-transparent border border-gray-300 rounded text-primary" />
</div>

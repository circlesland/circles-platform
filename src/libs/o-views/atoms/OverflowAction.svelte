<script lang="ts">
  import Button from "./Button.svelte";
  interface OverflowAction {
    data: {
      label: string;
    };
    design: {
      type: string;
    };
  }
  export let mapping: OverflowAction;
</script>

<Button {mapping} />

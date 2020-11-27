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
  export let mapping: OverFlowAction;
</script>

<Button {mapping} />

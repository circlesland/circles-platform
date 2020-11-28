<script lang="ts">
  import Button from "./Button.svelte";
  import { OverflowAction } from "./../interfaces/atoms";

  export let mapping: OverflowAction;
</script>

<Button {mapping} />

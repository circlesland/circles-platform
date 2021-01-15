<script lang="ts">
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import Header from "src/libs/o-views/molecules/Header.svelte";
  import Tokens from "src/dapps/safe/views/molecules/Tokens.svelte";
  import Mobile from "src/libs/o-views/templates/Mobile.svelte";
  let header = {
    data: {
      title: "Tokens",
    },
  };
</script>

<Tokens />

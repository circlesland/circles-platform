<script lang="ts">
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import Button from "src/libs/o-views/atoms/Button.svelte";
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";

  onMount(async () => {
    if (window.o.fission) {
      push("/omo/dapps");
    }
  });
</script>

<Compose rows="1fr" columns="1fr" tw="items-center justify-center">
  <Compose rows="1fr" columns="1fr">
    <img src="images/logo/logo.svg" alt="omo" class="w-1/3 mx-auto" />
    <div
      class="mx-auto text-xl text-center text-secondary font-title max-w-4/5">
      empowering your abundance
    </div>
    <div on:click={() => push('#/odentity/authenticate')}>
      <div class="mx-4 mx-auto my-12 md:w-1/2">
        <Button
          mapping={{ data: { label: 'Login' }, design: { type: 'primary' } }} />
      </div>
    </div>
  </Compose>
</Compose>

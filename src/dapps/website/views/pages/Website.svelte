<script lang="ts">
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import Button from "src/libs/o-views/atoms/Button.svelte";
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import Header from "../molecules/Header.svelte";
  import Hero from "../molecules/Hero.svelte";
  import Features from "../molecules/Features.svelte";
  import Pricing from "../molecules/Pricing.svelte";
  import Testimonials from "../molecules/Testimonials.svelte";
  import Footer from "../molecules/Footer.svelte";

  onMount(async () => {
    if (window.o.fission) {
      push("/omoli/dapps");
    }
  });
</script>

<!-- <Compose rows="1fr" columns="1fr" tw="items-center justify-center">
  <Compose rows="1fr" columns="1fr">
    <img src="images/logo/logo.svg" alt="omo" class="w-1/3 mx-auto" />
    <div
      class="mx-auto text-xl text-center text-secondary font-title max-w-4/5">
      empowering your abundance
    </div>
    <div on:click={() => push('#/omosapien/authenticate')}>
      <div class="px-4 mx-auto my-12 md:w-1/2">
        <Button
          mapping={{ data: { label: 'Login' }, design: { type: 'primary' } }} />
      </div>
    </div>
  </Compose>
</Compose> -->

<div class="overflow-x-hidden antialiased">
  <Header />
  <Hero />
  <Features />
  <Pricing />
  <Testimonials />
  <Footer />
</div>

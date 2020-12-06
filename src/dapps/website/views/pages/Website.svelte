<script lang="ts">
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import Header from "../molecules/Header.svelte";
  import Hero from "../molecules/Hero.svelte";
  import Features from "../molecules/Features.svelte";
  import Pricing from "../molecules/Pricing.svelte";
  import Testimonials from "../molecules/Testimonials.svelte";
  import Footer from "../molecules/Footer.svelte";
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import Offers from "src/dapps/omomarket/views/pages/Offers.svelte";
  import Video from "../molecules/Video.svelte";

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

<Compose rows="1fr" columns="1fr">
  <div class="overflow-x-hidden antialiased">
    <Header />
    <Hero />
    <div class="pb-12 bg-white">
      <Video />
    </div>
    <Features />
    <div class="pb-12 bg-light-100">
      <div
        class="container flex flex-col items-center justify-between h-full max-w-6xl py-12 mx-auto">
        <h2
          class="my-5 text-base font-bold tracking-tight uppercase text-tertiary font-title">
          Marketplace
        </h2>
        <h3
          class="max-w-4xl px-5 mt-2 text-4xl font-black leading-tight text-center text-primary sm:mt-0 sm:px-0 md:text-5xl">
          a new world of opportunities
        </h3>
      </div>
      <Offers />
    </div>
    <Pricing />
    <Testimonials />
    <Footer />
  </div>
</Compose>

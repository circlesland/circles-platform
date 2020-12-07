<script lang="ts">
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import Header from "../molecules/Header.svelte";
  import Hero from "../molecules/Hero.svelte";
  import Pricing from "../molecules/Pricing.svelte";
  import Testimonials from "../molecules/Testimonials.svelte";
  import Footer from "../molecules/Footer.svelte";
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import Offers from "src/dapps/omomarket/views/pages/Offers.svelte";
  import Video from "../molecules/Video.svelte";
  import Steps from "../molecules/Steps.svelte";
  import Featured from "../molecules/Featured.svelte";
  import Details from "../molecules/Details.svelte";

  onMount(async () => {
    if (window.o.fission) {
      push("/omoli/dapps");
    }
  });
</script>

<Compose rows="1fr" columns="1fr">
  <div class="overflow-x-hidden antialiased">
    <Header />
    <Hero />
    <div class="pb-12 bg-white">
      <Video />
    </div>
    <Steps />
    <Featured />
    <div class="pb-12 bg-light-100">
      <div
        class="container flex flex-col items-center justify-between h-full max-w-6xl py-12 mx-auto">
        <h2
          class="my-5 text-base font-bold tracking-tight uppercase text-tertiary font-title">
          The Omo Marketplace
        </h2>
        <h3
          class="max-w-4xl px-5 mt-2 text-4xl font-black leading-tight text-center text-primary sm:mt-0 sm:px-0 md:text-5xl">
          discover a new world of opportunities
        </h3>
      </div>
      <Offers />
      <a href="https://discord.gg/YedewwChD9">
        <button
          class="flex px-4 py-1 mx-auto mt-16 text-base font-bold lowercase bg-white border text-primary border-secondary rounded-xl focus:outline-none hover:text-white hover:bg-secondary-lighter">
          create new offer
        </button>
      </a>
    </div>
    <Details />
    <Pricing />
    <Testimonials />
    <Footer />
  </div>
</Compose>

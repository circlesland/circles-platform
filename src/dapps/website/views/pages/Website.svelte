<script lang="ts">
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import Header from "../molecules/Header.svelte";
  import Hero from "../molecules/Hero.svelte";
  import Pricing from "../molecules/Pricing.svelte";
  import Footer from "../molecules/Footer.svelte";
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import Offers from "src/dapps/omomarket/views/pages/Offers.svelte";
  import Video from "../molecules/Video.svelte";
  import Steps from "../molecules/Steps.svelte";
  import Featured from "src/dapps/omofunding/pages/Featured.svelte";
  import Details from "../molecules/Details.svelte";

  onMount(async () => {
    if (window.o.fission) {
      push("/omoli/dapps");
    }
  });
</script>

<Compose rows="1fr" columns="1fr">
  <div class="w-full overflow-x-hidden antialiased">
    <Header />
    <Hero />

    <Video />
    <Steps />
    <div class="bg-gray-50">
      <div class="flex flex-col items-center w-full px-5 py-24 mx-auto ">
        <h2
          class="my-5 text-base font-bold tracking-wide uppercase text-tertiary">
          Featured Projects
        </h2>
        <h3
          class="max-w-4xl px-5 mt-2 text-3xl font-black leading-loose tracking-wide text-center font-title text-secondary sm:mt-0 sm:px-0 md:text-5xl">
          <div>Crowdfund your future</div>
          <div class="mt-3">one project a time</div>
        </h3>
      </div>
      <Featured />
    </div>
    <div
      class="flex flex-col items-center w-full px-5 py-24 mx-auto bg-light-100">
      <h2
        class="my-5 text-base font-bold tracking-wide uppercase text-tertiary">
        The Omo Marketplace
      </h2>
      <h3
        class="max-w-4xl px-5 pb-12 mt-2 text-3xl font-black leading-loose tracking-wide text-center font-title text-secondary sm:mt-0 sm:px-0 md:text-5xl">
        <div>Enjoy the growth</div>
        <div class="mt-3">of your own economy</div>
      </h3>
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
    <!-- <Testimonials /> -->
    <Footer />
  </div>
</Compose>

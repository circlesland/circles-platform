<script lang="ts">
  import { onMount } from "svelte";
  import Header from "../molecules/Header.svelte";
  import Hero from "../molecules/Hero.svelte";
  import Pricing from "../molecules/Pricing.svelte";
  import Footer from "../molecules/Footer.svelte";
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import Offers from "src/dapps/omomarket/views/molecules/Offers.svelte";
  import Video from "../molecules/Video.svelte";
  import Steps from "../molecules/Steps.svelte";
  import Details from "../molecules/Details.svelte";
  import {initAuth, runWithDrive} from "../../../../libs/o-fission/initFission";

  onMount(async () => {
    runWithDrive(async drive => {

    }).then(() => {
      console.log("Initialized drive:");
    });
  });
</script>

<Compose rows="1fr" columns="1fr">
  <div class="w-full overflow-x-hidden antialiased">
    <Header />
    <Video />
    <Hero />
    <Steps />
    <!-- <div class="bg-gray-50">
      <div class="flex flex-col items-center w-full px-5 py-24 mx-auto ">
        <h2
          class="my-5 text-base font-bold tracking-wide uppercase text-tertiary">
          Featured Projects
        </h2>
        <h3
          class="max-w-4xl px-5 mt-2 text-3xl font-black leading-loose tracking-wide text-center uppercase font-title text-primary sm:mt-0 sm:px-0 md:text-5xl">
          <div>Crowdfund your dreams<br />one project a time</div>
        </h3>
      </div>
      <Projects />
    </div> -->
    <div
      class="flex flex-col items-center w-full px-5 py-24 mx-auto bg-light-100">
      <h2
        class="my-5 text-base font-bold tracking-wide uppercase text-tertiary">
        Omo Marketplace
      </h2>
      <h3
        class="max-w-4xl px-5 pb-12 mt-2 text-3xl font-black leading-loose tracking-wide text-center uppercase font-title text-primary sm:mt-0 sm:px-0 md:text-5xl">
        <div>Enjoy the growth<br />of your own economy</div>
      </h3>
      <Offers />
    </div>
    <Details />
    <Pricing />
    <!-- <Testimonials /> -->
    <Footer />
  </div>
</Compose>

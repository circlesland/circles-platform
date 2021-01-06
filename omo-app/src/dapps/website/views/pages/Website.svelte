<script lang="ts">
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import Header from "../molecules/Header.svelte";
  import Hero from "../molecules/Hero.svelte";
  import Pricing from "../molecules/Pricing.svelte";
  import Footer from "../molecules/Footer.svelte";
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import Offers from "src/dapps/omomarket/views/molecules/Offers.svelte";
  import Video from "../molecules/Video.svelte";
  import Steps from "../molecules/Steps.svelte";
  import Details from "../molecules/Details.svelte";
  import {setDappState} from "../../../../libs/o-os/loader";
  import {FissionAuthState} from "../../../fissionauth/manifest";
  import {FissionDrive} from "../../../../libs/o-fission/fissionDrive";

  onMount(async () => {
    await initAuth();
  });

  async function initAuth()
  {
      const state = await window.o.wn.initialise({
        permissions: {
          // Will ask the user permission to store
          // your apps data in `private/Apps/{creator}}/{name}`
          app: {
            name: "OmoSapien",
            creator: "MamaOmo",
          },
          fs: {
            publicPaths: ["omo.sapien"],
          },
        },
        loadFileSystem: false
      });

      switch (state.scenario)
      {
        case window.o.wn.Scenario.AuthCancelled:
          break;

        case window.o.wn.Scenario.AuthSucceeded:
        case window.o.wn.Scenario.Continuation:

          try
          {
            // State:
            // state.authenticated    -  Will always be `true` in these scenarios
            // state.newUser          -  If the user is new to Fission
            // state.throughLobby     -  If the user authenticated through the lobby, or just came back.
            // state.username         -  The user's username.
            //
            // ☞ We can now interact with our file system (more on that later)
            setDappState<FissionAuthState>("omo.fission.auth:1", current =>
            {
              return {
                username: state.username,
                fission: new FissionDrive(state)
              };
            });

            // set a marker in the local storage that indicates whether we've already logged-in
            localStorage.setItem("fissionAuth", JSON.stringify({
              username: state.username
            }));

            if (params && params.redirectTo)
            {
              window.o.redirectTo = params.redirectTo;
            }

            if (window.o.redirectTo)
            {
              push("#/waiting-area/please-wait");
            }
            else
            {
              push("#/omosapien/profile");
            }
          }
          catch (e)
          {
            console.error("Something went wrong during the authentication process: ", e);
          }
          break;
      }
  }
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

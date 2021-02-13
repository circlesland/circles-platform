<script lang="ts">
  import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

  import Icon from "fa-svelte";
  import { push } from "svelte-spa-router";
</script>

<div
  id="features"
  class="relative w-full px-8 py-10 bg-light-100 md:py-16 lg:py-24 xl:py-40 xl:px-0"
>
  <div
    class="container flex flex-col items-center justify-between h-full max-w-6xl mx-auto"
  >
    <h2
      class="my-5 text-base font-bold tracking-tight uppercase text-tertiary "
    >
      How it works
    </h2>
    <h3
      class="max-w-4xl px-5 mt-2 text-3xl font-black leading-loose tracking-wide text-center uppercase font-title text-primary sm:mt-0 sm:px-0 md:text-5xl"
    >
      <div>Only 3 steps<br /> towards your own money</div>
    </h3>
    <div
      class="flex flex-col w-full mt-0 lg:flex-row sm:mt-10 lg:mt-20 text-primary"
    >
      <div class="w-full mx-auto mb-0 sm:mb-16 lg:mb-0 lg:w-1/3">
        <div
          class="relative flex flex-col items-center justify-center w-full h-full p-20 mr-5 rounded-lg"
        >
          <img src="illustrations/register.svg" alt="register" />

          <h4
            class="relative mt-6 text-2xl font-black text-center uppercase font-title text-primary"
          >
            Register
          </h4>
          <p class="relative mt-2 text-lg font-bold text-center text-tertiary">
            Receive a 150⦿ welcome gift, when you first register your Omo Sapien
            Identity
          </p>
        </div>
      </div>

      <div class="w-full mx-auto mb-0 sm:mb-8 lg:mb-0 lg:w-1/3">
        <div
          class="relative flex flex-col items-center justify-center w-full h-full px-12 py-4 mr-5 rounded-lg"
        >
          <img src="illustrations/support.svg" alt="support" />

          <h4
            class="relative mt-6 text-2xl font-black text-center uppercase font-title text-primary"
          >
            Grow
          </h4>
          <p class="relative mt-2 text-lg font-bold text-center text-tertiary">
            Grow your future economy by offering at least 1 product or service
            for minimum 100⦿
          </p>
        </div>
      </div>

      <div class="w-full mx-auto mb-16 lg:mb-0 lg:w-1/3">
        <div
          class="relative flex flex-col items-center justify-center w-full h-full p-20 mr-5 rounded-lg"
        >
          <img src="illustrations/grow.svg" alt="grow" />
          <h4
            class="relative mt-6 text-2xl font-black text-center uppercase font-title text-primary"
          >
            Enjoy
          </h4>
          <p class="relative mt-2 text-lg font-bold text-center text-tertiary">
            Make your first purchase in ⦿ to unlock your personal money at 1⦿
            per hour
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="flex justify-center w-full mx-auto">
    <button
      on:click={() => push("#/omoli/dapps")}
      class="inline-flex items-center px-4 py-2 mt-4 text-xl font-bold text-white lowercase border-0 bg-secondary rounded-xl focus:outline-none hover:bg-white hover:text-secondary hover:border hover:border-light-300 md:mt-0"
      >Signup Now
      <span class="mb-1 ml-2"><Icon icon={faUserCircle} /> </span></button
    >
  </div>
</div>

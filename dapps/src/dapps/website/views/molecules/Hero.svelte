<script lang="ts">
  import Button from "src/libs/o-views/atoms/Button.svelte";
  import { push } from "svelte-spa-router";
</script>

<div
  class="items-center justify-center w-full py-20 overflow-x-hidden bg-white lg:py-40 xl:pt-40 xl:pb-64"
>
  <div
    class="container flex flex-col items-center justify-between h-full max-w-6xl px-8 mx-auto -mt-32 lg:flex-row lg:px-0"
  >
    <div
      class="z-30 flex flex-col items-center w-full max-w-xl pt-40 text-center lg:items-start lg:w-1/2 lg:pt-16 xl:pt-24 lg:text-left"
    >
      <h1
        class="relative text-2xl font-black tracking-wide uppercase font-title text-secondary sm:text-3xl lg:text-4xl xl:mb-4"
      >
        <span class="text-4xl sm:text-5xl lg:text-6xl">Own your money</span>
        <br />
        <span class="text-3xl sm:text-4xl lg:text-5xl">grow your passion</span
        ><br />
        <span class="text-3xl sm:text-4xl lg:text-5xl">Sustain your earth!</span
        >
      </h1>
      <p
        class="pr-0 mb-20 text-base text-light-500 sm:text-lg xl:text-xl lg:pr-20 "
      >
        Grow now your own personal money tightly interconnected to your time
        alive and sustain your planet with a passionate economy and inclusive
        money design for every human.
      </p>
      <!-- <div
        on:click={() => push('#/omoli/dapps')}
        class="z-50 mb-20 cursor-pointer w-60">
        <Button
          mapping={{ data: { label: 'start growing now' }, design: { type: 'primary' } }} />
      </div> -->
      <div class="flex-col hidden mt-12 sm:flex lg:mt-24">
        <p
          class="mb-4 text-sm font-medium tracking-widest text-gray-500 uppercase"
        >
          Build on the foundation of great open source teams
        </p>
        <div class="flex justify-center space-x-4 md:justify-start">
          <img src="logos/circles.svg" alt="circlesUBI" class="w-12 h-12" />
          <img src="logos/fission.svg" alt="fission" class="w-12 h-12" />
          <img src="logos/ucan.png" alt="ucan" class="w-12 h-12" />
          <img src="logos/gnosissafe.svg" alt="gnosissafe" class="w-12 h-12" />
          <img src="logos/ipfs.png" alt="ipfs" class="w-12 h-12" />
          <img src="logos/ethereum.png" alt="ethereum" class="w-12 h-12" />
          <img src="logos/xdai.svg" alt="xDai" class="w-12 h-12" />
        </div>
      </div>
    </div>
    <div
      class="relative z-50 flex-col items-end justify-center hidden w-full h-full mt-24 md:flex md:m-0 lg:w-1/2 ms:pl-10"
    >
      <div
        class="container relative left-0 w-full max-w-4xl lg:absolute xl:max-w-6xl lg:w-screen"
      >
        <img
          src="./illustrations/laptop.png"
          alt="img"
          class="w-full h-auto mt-20 mb-20 ml-0 lg:mt-24 xl:mt-40 lg:mb-0 lg:h-full lg:-ml-12"
        />
      </div>
    </div>
  </div>
</div>

<script lang="ts">
  import Offers from "../molecules/Offers.svelte";
</script>

<div class="overflow-y-scroll bg-gray-50">
  <section
    class="flex flex-col items-center justify-center w-full font-sans text-center bg-cover h-96"
    style="background:url('https://source.unsplash.com/-gOUx23DNks') no-repeat center center; background-size: cover; width: 100%">
    <div
      class="flex flex-col items-center justify-center w-full text-center bg-cover opacity-50 h-96 bg-dark">
      <h3
        class="m-4 mx-auto text-4xl font-black leading-normal text-white uppercase md:m8 md:text-6xl font-title">
        Enjoy the growth
        <br />of your own economy
      </h3>
    </div>
  </section>
  <Offers />
</div>

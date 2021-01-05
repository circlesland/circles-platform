<script lang="ts">
  import Icon from "fa-svelte";
  import { faPlay } from "@fortawesome/free-solid-svg-icons";
</script>

<section
  class="flex flex-col items-center justify-center w-full font-sans text-center bg-cover"
  style="background:url(./images/video.jpg) no-repeat center;">
  <div
    class="flex flex-col items-center justify-center w-full h-full py-32 text-center bg-cover opacity-50 bg-dark">
    <div
      class="flex items-center justify-center w-24 h-24 mb-8 bg-white rounded-full text-primary hover:bg-gray-200">
      <Icon icon={faPlay} class="text-xl" />
    </div>
    <label
      for=""
      class="text-xs font-hairline text-white uppercase tracking-extrawide">
      Watch Video
    </label>
    <h3
      class="m-4 mx-auto text-4xl font-black leading-normal text-white uppercase md:m8 md:text-6xl font-title">
      Ready to follow your dreams?<br />
      <span class="text-2xl">(video coming soon)</span>
    </h3>
  </div>
</section>

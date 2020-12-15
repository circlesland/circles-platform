<script lnag="ts">
  let data = {
    dream: {
      title: "",
      city: "",
      description: "",
    },
  };
</script>

<section class="py-4 font-sans bg-white">
  <section class="relative py-16">
    <div class="container px-20 mx-auto">
      <div
        class="relative flex flex-col w-full min-w-0 mb-6 -mt-40 break-words bg-white rounded-lg shadow-xl">
        <div class="w-full px-6 text-white bg-primary">
          <div class="flex flex-wrap justify-center py-4 pt-8 lg:pt-4">
            <div class="p-3 mr-4 text-center">
              <span
                class="block text-3xl font-bold tracking-wide text-white uppercase">
                10
              </span>
              <span class="text-xs font-bold text-blue-400 uppercase">
                Dreamers
              </span>
            </div>
            <div class="p-3 mr-4 text-center">
              <span
                class="block text-3xl font-bold tracking-wide text-white uppercase">
                33
              </span>
              <span class="text-xs font-bold text-blue-400 uppercase">
                of 100% reached
              </span>
            </div>
            <div class="p-3 text-center lg:mr-4">
              <span
                class="block text-3xl font-bold tracking-wide text-white uppercase">
                60
              </span>
              <span class="text-xs font-bold text-blue-400 uppercase">
                of Ø 91 / week goal
              </span>
            </div>
          </div>
        </div>
        <!--<OmoAvatarsGrouped data={dreamers}/>-->
        <div class="mt-4 text-center">
          <h3 class="mb-2 text-4xl font-semibold leading-normal text-gray-800">
            {data.dream.name}
          </h3>
          <div
            class="mt-0 mb-2 text-sm font-bold leading-normal text-gray-500 uppercase">
            <i class="mr-2 text-lg text-gray-500 fas fa-map-marker-alt" />
            {data.dream.city}
          </div>
        </div>
        <div class="py-10 mt-10 text-center border-t border-gray-300">
          <div class="flex flex-wrap justify-center">
            <div class="w-full px-4 lg:w-9/12">
              <p class="text-lg leading-relaxed text-gray-800">
                {data.dream.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</section>

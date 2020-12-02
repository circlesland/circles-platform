<script lang="ts">
  import { faMap, faPlane } from "@fortawesome/free-solid-svg-icons";
  import Icon from "fa-svelte";

  import Compose from "src/libs/o-views/atoms/Compose.svelte";

  let offers = [
    {
      data: {
        title: "Bavarian Leathershoes (Size 44)",
        image:
          "https://images.unsplash.com/photo-1519139270028-ab664cf42264?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
        description: "slightly used marks",
        price: "500",
        city: "Bad Endorf",
        country: "Germany",
        user: "Samuel Andert",
        delivery: "pickup or delivery in germany",
      },
    },
    {
      data: {
        title: "Bavarian Leathershoes (Size 44)",
        description: "slightly used marks",
        price: "300",
        city: "Munich, ",
        country: "Germany",
        user: "Samuel Andert",
        delivery: "pickup or delivery in germany",
      },
    },
  ];
</script>

<Compose rows="1fr" columns="1fr" overflowY>
  <div class="grid w-full gap-10">
    {#each offers as item}
      <div
        class="flex flex-col overflow-hidden bg-white border shadow-md rounded-xl hover:shadow-lg">
        <img
          class="object-cover w-full h-72 "
          src={item.data.image}
          alt="..."
          style="clip-path: polygon(0 0, 100% 0%, 100% 100%, 0 80%);" />

        <div class="p-4 -mt-6 md:-mt-8">
          <span
            class="flex font-semibold capitalize font-title text-light-500 md:text-xl">
            <p class="text-4xl text-secondary">{item.data.price}</p>
            <img
              src="images/logo/crc-dark.svg"
              alt="CRC"
              class="w-6 h-6 mt-2" />
          </span>

          <div class="md:mt-2">
            <p
              class="font-sans text-base antialiased font-semibold leading-6 text-primary md:text-lg">
              {item.data.title}
            </p>
          </div>

          <div class="flex pt-1 md:pt-4">
            <span
              class="font-sans text-xs text-gray-600 font-edium md:text-base">{item.data.description}</span>
            <span
              class="px-4 font-sans text-xs font-medium text-gray-600 md:text-base" />
          </div>
        </div>

        <div class="flex p-4 align-middle border-t text-light-500">
          <div>
            <Icon icon={faMap} />
          </div>

          <div class="px-4">
            <span
              class="font-sans text-xs font-medium text-light-500 md:text-sm">
              {item.data.city},
              {item.data.country}
              | ({item.data.delivery})</span>
          </div>
        </div>
      </div>
    {/each}
  </div>
</Compose>

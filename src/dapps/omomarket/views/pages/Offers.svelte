<script lang="ts">
  import { faMap, faPlane } from "@fortawesome/free-solid-svg-icons";
  import Icon from "fa-svelte";

  import Compose from "src/libs/o-views/atoms/Compose.svelte";

  let offers = [
    // {
    //   data: {
    //     title: "UNU 2 Electro Scooter",
    //     image: "./images/market/unu.jpg",
    //     description:
    //       "Brand new UNU electro scooter delivered straight from the factory to your home. I pre-ordered this unique beauty this summer and according to UNU will be ready for shipping around spring 2021. In the package is a 4000 watt black scooter with 2 batteries and 1 helmet. For more details see unu's website @https://unumotors.com/",
    //     price: "50.000",
    //     city: "Munich or Berlin",
    //     country: "Germany",
    //     delivery:
    //       "pickup or delivery all over europe (pre-order now, delivered in spring / summer 2021)",
    //     offeredBy: {
    //       image: "images/users/samuel.jpg",
    //       firstName: "Samuel",
    //       lastName: "Andert",
    //     },
    //   },
    // },
    {
      data: {
        title: "Bavarian Leathershoes (Size 44)",
        image: "./images/market/shoes.jpg",
        description:
          "almost new, only worn 2 times, slightly used marks at the tips of the shoes",
        price: "500",
        city: "Bad Endorf",
        country: "Germany",
        delivery: "pickup or delivery in germany",
        offeredBy: {
          image: "images/users/samuel.jpg",
          firstName: "Samuel",
          lastName: "Andert",
        },
      },
    },
    {
      data: {
        image: "./images/market/lederhose.jpg",
        title: "Bavarian Lederhosn (Size 48)",
        description: "almost new, only worn 2 times, slightly used marks",
        price: "800",
        city: "Bad Endorf",
        country: "Germany",
        delivery: "pickup or delivery in germany",
        offeredBy: {
          image: "images/users/samuel.jpg",
          firstName: "Samuel",
          lastName: "Andert",
        },
      },
    },
    {
      data: {
        image: "./images/market/hemdblau.jpg",
        title: "Blue plaid shirt (Size S/M 37/38)",
        description: "almost new, only worn 2 times",
        price: "200",
        city: "Bad Endorf",
        country: "Germany",
        delivery: "pickup or delivery in germany",
        offeredBy: {
          image: "images/users/samuel.jpg",
          firstName: "Samuel",
          lastName: "Andert",
        },
      },
    },
    {
      data: {
        image: "./images/market/hemdrot.jpg",
        title: "Red plaid shirt (Size S/M 39/40)",
        description: "almost new, only worn 2 times",
        price: "200",
        city: "Bad Endorf",
        country: "Germany",
        delivery: "pickup or delivery in germany",
        offeredBy: {
          image: "images/users/samuel.jpg",
          firstName: "Samuel",
          lastName: "Andert",
        },
      },
    },
  ];
</script>

<Compose rows="1fr" columns="1fr" overflowY>
  <div class="grid w-full gap-10 p-4 text-primary md:p-0">
    {#each offers as item}
      <div
        class="flex flex-col overflow-hidden bg-white border shadow-md rounded-xl hover:shadow-lg">
        <img
          class="object-cover w-full"
          src={item.data.image}
          alt="..."
          style="clip-path: polygon(0 0, 100% 0%, 100% 100%, 0 90%);" />

        <div class="p-4 -mt-6 md:-mt-8">
          <span
            class="flex font-semibold capitalize font-title text-light-500 md:text-xl">
            <p class="text-4xl text-light-500">{item.data.price}</p>
            <img
              src="images/logo/crc-dark.svg"
              alt="CRC"
              class="w-6 h-6 mt-2" />
          </span>

          <div class="md:mt-2">
            <p
              class="font-sans text-base antialiased font-semibold leading-6 text-primary md:text-xl">
              {item.data.title}
            </p>
          </div>

          <div class="flex pt-1 md:pt-2">
            <span
              class="font-sans text-xs text-gray-500 font-edium md:text-base">{item.data.description}</span>
            <span
              class="px-4 font-sans text-xs font-medium text-gray-600 md:text-base" />
          </div>
          <div class="pt-4">
            <span
              class="font-sans text-xs font-medium text-light-500 md:text-sm">
              {item.data.city},
              {item.data.country}
              | ({item.data.delivery})</span>
          </div>
        </div>

        <div class="flex p-4 align-middle border-t text-light-500">
          <div>
            <img
              src={item.data.offeredBy.image}
              alt="user"
              class="w-12 h-12 rounded-xl" />
          </div>

          <div class="flex-1 px-4">
            <a
              href="https://discord.gg/YedewwChD9"
              class="font-sans text-base font-bold text-primary font-primary">
              {item.data.offeredBy.firstName}
              {item.data.offeredBy.lastName}
              <br />
              <span class="text-sm text-light-500">-> Contact
                {item.data.offeredBy.firstName}
                in the Chat to arrange purchase</span></a>
          </div>
        </div>
      </div>
    {/each}
  </div>
</Compose>

<script lang="ts">
  import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

  import Icon from "fa-svelte";
  import Compose from "src/libs/o-views/atoms/Compose.svelte";

  let offers = [
    {
      data: {
        title: "Bavarian Leathershoes (Size 44)",
        image: "./images/market/shoes.jpg",
        description:
          "almost new, only worn 2 times, slightly used marks at the tips of the shoes",
        price: "500",
        city: "Bad Endorf",
        country: "Germany",
        delivery: "pickup or delivery",
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
        price: "1000",
        city: "Bad Endorf",
        country: "Germany",
        delivery: "pickup or delivery",
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
        price: "150",
        city: "Bad Endorf",
        country: "Germany",
        delivery: "pickup or delivery",
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
        price: "150",

        city: "Bad Endorf",
        country: "Germany",
        delivery: "pickup or delivery",
        offeredBy: {
          image: "images/users/samuel.jpg",
          firstName: "Samuel",
          lastName: "Andert",
        },
      },
    },
    {
      data: {
        image: "./images/market/roomsamuel.jpg",
        title: "1-room in shared apartment",
        description:
          "stay 1 night in the center of Munich in a 16qm room in my shared apartment",
        interval: "night",
        price: "300",
        city: "Munich",
        country: "Germany",
        delivery: "ask for the address",
        offeredBy: {
          image: "images/users/samuel.jpg",
          firstName: "Samuel",
          lastName: "Andert",
        },
      },
    },
    {
      data: {
        image: "./images/market/iphone.jpg",
        title: "iPhone 7 with broken screen",
        description:
          "the iPhone is working fine and even got a fresh battery, only the screen is broken and needs to be replaced.",
        interval: "",
        price: "750",
        city: "Bad Endorf",
        country: "Germany",
        delivery: "pickup or delivery",
        offeredBy: {
          image: "images/users/samuel.jpg",
          firstName: "Samuel",
          lastName: "Andert",
        },
      },
    },
    {
      data: {
        title: "UNU 2 Electro Scooter",
        image: "./images/market/unu.jpg",
        description:
          "Brand new UNU electro scooter delivered straight from the factory to your home. I pre-ordered this unique beauty this summer and according to UNU will be ready for shipping around spring 2021. In the package is a 4000 watt black scooter with 2 batteries and 1 helmet. For more details see: https://unumotors.com/",
        price: "100.000",
        city: "Munich or Berlin",
        country: "Germany",
        delivery: "pickup or delivery",
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
  <div class="grid gap-5 p-4 mx-auto md:p-12 md:grid-cols-2 lg:grid-cols-3">
    {#each offers as item}
      <div
        class="flex flex-col overflow-hidden border rounded-xl border-light-300">
        <div class="relative flex-shrink-0">
          <img
            class="object-cover w-full h-72"
            src={item.data.image}
            alt="img" />
          <span
            class="absolute top-0 right-0 inline-flex items-center px-4 pt-2 pb-1 mt-4 text-3xl font-medium leading-tight text-white rounded-l-full bg-secondary">
            {item.data.price}<img
              src="symbols/o-white.svg"
              alt="o"
              class="w-4 h-4 mb-1 ml-1" />
            {#if item.data.interval}
              <span
                class="ml-1 text-xs text-blue-200">/{item.data.interval}</span>
            {/if}</span>
        </div>
        <div class="flex flex-col justify-between flex-1">
          <div class="flex flex-col justify-between flex-1 p-6 bg-white">
            <div>
              <p class="block text-xl font-semibold leading-7 text-primary">
                {item.data.title}
              </p>
              <p class="mt-3 text-sm leading-6 text-light-500">
                {item.data.description}
              </p>
            </div>
          </div>
          <div class="flex items-center p-4 border-t border-light-200">
            <div class="flex-shrink-0">
              <img
                class="w-10 h-10 rounded-xl"
                src={item.data.offeredBy.image}
                alt="" />
            </div>
            <div class="ml-3">
              <div class="text-sm font-medium leading-5 text-primary">
                <p href="#" class="hover:underline">
                  {item.data.offeredBy.firstName}
                  {item.data.offeredBy.lastName}
                </p>
              </div>
              <div class="text-xs leading-5 text-gray-600">
                {item.data.city},
                {item.data.country}
                |
                {item.data.delivery}
              </div>
            </div>
          </div>
          <a
            href="https://discord.gg/YedewwChD9"
            class="flex items-center w-full p-4 space-x-4 ">
            <button
              class="w-full px-4 py-2 font-semibold bg-transparent border-2 text-secondary border-secondary rounded-xl hover:bg-secondary hover:text-white hover:border-transparent">
              Contact to Buy
              <Icon icon={faShoppingCart} />
            </button>
          </a>
        </div>
      </div>
    {/each}
  </div>
</Compose>

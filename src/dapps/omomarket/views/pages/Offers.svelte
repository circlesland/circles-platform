<script lang="ts">
  import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
  import ButtonIconLarge from "src/libs/o-views/atoms/ButtonIconLarge.svelte";

  import Compose from "src/libs/o-views/atoms/Compose.svelte";

  let offers = [
    {
      data: {
        title: "Bavarian Leathershoes (Size 44)",
        image: "./images/market/shoes.jpg",
        description:
          "almost new, only worn 2 times, slightly used marks at the tips of the shoes",
        price: "800",
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
        price: "1500",
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
        price: "300",
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
        price: "300",
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

<Compose
  columns="repeat(auto-fit, minmax(400px, 1fr))"
  rows="repeat({offers.length}, minmax(1fr, 1fr))"
  tw="mx-4 py-4 md:mx-12"
  gap="1.5rem"
  overflowY>
  {#each offers as item}
    <div class="antialiased text-primary wrapper">
      <div>
        <img
          src={item.data.image}
          alt="image"
          class="object-cover object-center w-full rounded-lg shadow-md h-72 md:h-96" />
        <div class="relative px-4 -mt-16">
          <div
            class="flex px-4 pt-2 pb-1 text-3xl font-bold text-primary rounded-t-xl font-primary bg-light-200">
            {item.data.price}
            <span class="flex items-center px-1 pb-1"><img
                src="images/symbols/o.svg"
                alt="o"
                class="w-4 h-4" />
            </span>
          </div>
          <div class="p-6 bg-white shadow-lg rounded-b-xl">
            <div class="flex items-baseline">
              <div
                class="font-semibold tracking-wider uppercase text-xxs text-light-500 ">
                {item.data.city},
                {item.data.country}
                |
                {item.data.delivery}
              </div>
            </div>

            <h4 class="mt-4 mb-2 text-xl font-semibold leading-tight">
              {item.data.title}
            </h4>
            <div class="mb-3 text-light-500">{item.data.description}</div>

            <div class="flex pt-4 border-t text-light-500 ">
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
                  <span class="text-sm text-light-500">Contact me in
                    <span class="text-primary hover:text-secondary-lighter">
                      Chat</span>
                    to buy</span></a>
              </div>
              <a href="https://discord.gg/YedewwChD9" class="w-12 h-12">
                <ButtonIconLarge
                  mapping={{ design: { icon: faShoppingCart, type: 'primary' } }} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/each}
</Compose>

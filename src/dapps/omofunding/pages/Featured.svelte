<script>
  import { faRocket, faShoppingCart } from "@fortawesome/free-solid-svg-icons";

  import Icon from "fa-svelte";

  let projects = [
    {
      data: {
        category: "Campaign",
        title: "I am Omo Sapien",
        subtitle:
          "Discover with us human's full creative potential opening the doors into a new age of abundance",
        image: "images/funding/omojourney.jpg",
        description: "Campaign description (coming soon).",
        price: "50",
        quantity: " human",
        ordersInO: "50",
        ordersGoalInO: "500.000",
        backers: "1",
        backersGoal: "10.000",
        progressInPercent: "1%",
        offeredBy: {
          firstName: "Samuel",
          lastName: "Andert",
          image: "./images/users/samuel.jpg",
          location: "Munich, Germany",
          delivery: "January 2021",
        },
      },
    },
    {
      data: {
        category: "Food & Beverages",
        title: "Pflanzenstoff Superfruitdrink",
        subtitle: "Activate the powerplants of your body cells",
        image: "images/funding/pflanzenstoff.jpg",
        description:
          "Pflanzenstoff's superfruits can support your concentration, stamina and your mental and bodily health. A vegan fruit and vegetable drink with just 2.5g sugar. It tastes lively and refreshing with its natural only superfood incredients; Acerola, Aronia, Assai, Blackberries, Curcumin, Gojibeeren, Pomoegranate, Green Tea, Ginger, Carot, Mangosteen, Oranges, Beetroot and Grapes.",
        price: "100",
        quantity: "6 pack",
        ordersInO: "450",
        ordersGoalInO: "150.000",
        backers: "3",
        backersGoal: "1.000",
        daysToGo: 119,
        daysLimit: 120,
        progressInPercent: "1%",
        offeredBy: {
          firstName: "Olivia",
          lastName: "Okafor",
          image: "./images/users/olivia.jpg",
          location: "Bad Endorf, Germany",
          delivery: "April 2021",
        },
      },
    },
    {
      data: {
        category: "Food & Beverages",
        title: "The Great White Chuck",
        image: "images/funding/chuck.jpg",
        subtitle:
          "Enjoy the lightness and liveliness of Great White Chuck's wine for an enjoyable evening with friends",
        description:
          "The Great White Chuck is a white wine from us, Patrick and Chuck. We have discovered over the last year our passion for wines and want to share our taste with you now. Join our journey, as we continue to source the best breeds for you, always perfectly balancing quality and price. By supporting this campaign you kickstart our first order of bottles",
        price: "80",
        quantity: "1 bottle",
        ordersInO: "150",
        ordersGoalInO: "60.000",
        backers: "1",
        backersGoal: "400",
        progressInPercent: "1%",
        offeredBy: {
          firstName: "Chuck",
          lastName: "Nwokolo",
          image: "./images/users/chuck.jpg",
          location: "Munich, Germany",
          delivery: "March 2021",
        },
      },
    },
    {
      data: {
        category: "Food & Beverages",
        title: "Original greek aromatic oliveoil",
        image: "images/funding/oliveoil.jpg",
        subtitle:
          "Have you ever tried really good oliveoil? You will be astonished!",
        description: "coming soon",
        price: "200",
        quantity: "1 liter",
        ordersInO: "250",
        ordersGoalInO: "100.000",
        backers: "1",
        backersGoal: "500",
        progressInPercent: "1%",
        offeredBy: {
          firstName: "Timo",
          lastName: "Cook",
          image: "./images/users/timon.jpg",
          location: "Oslo, Norway",
          delivery: "April 2021",
        },
      },
    },
  ];
</script>

<div
  class="grid max-w-lg gap-5 p-2 mx-auto overflow-y-scroll md:gap-10 md:p-12 md:grid-cols-2 md:max-w-none">
  {#each projects as item}
    <div
      class="relative overflow-hidden text-gray-800 bg-white rounded-lg shadow hover:shadow-lg">
      <div class="relative w-full">
        <img
          class="object-cover w-full h-96 rounded-t-xl"
          src={item.data.image}
          alt="img" />
        <span
          class="absolute top-0 right-0 inline-flex items-center px-4 pt-2 pb-1 mt-4 text-3xl font-medium leading-tight text-white rounded-l-full bg-secondary">
          {item.data.price}<img
            src="symbols/o-white.svg"
            alt="o"
            class="w-4 h-4 mb-1 ml-1" />
          {#if item.data.quantity}
            <span
              class="ml-1 text-xs text-blue-200">/{item.data.quantity}</span>
          {/if}</span>
      </div>
      <div class="z-30 flex justify-center">
        <img
          src={item.data.offeredBy.image}
          class="z-30 object-cover object-center mr-2 -mt-20 bg-white border-8 border-white rounded-full h-36 w-36"
          alt="" />
      </div>

      <div class="h-40 p-4 overflow-hidden sm:h-60 md:h-84">
        <div
          class="text-xl font-bold text-center uppercase font-title text-primary">
          {item.data.title}
        </div>
        <p class="text-center text-gray-600">{item.data.subtitle}</p>
        <div class="h-full px-4 py-3 text-sm text-center text-light-500">
          {item.data.description}
        </div>
      </div>

      <section class="w-full mt-4 border-t text-light-500 border-light-200">
        <div class="container w-full p-4 mx-auto md:p-6">
          <div class="flex flex-wrap justify-between text-center">
            <div class="w-1/2 p-2 mx-auto text-center">
              <div class="flex justify-center">
                <h2
                  class="flex text-3xl font-medium text-primary title-font sm:text-4xl">
                  {item.data.ordersInO}
                  <div class="mt-3 ml-1">
                    <img src="symbols/o.svg" alt="o" class="w-4 h-4" />
                  </div>
                </h2>
              </div>
              <p class="text-xs leading-relaxed">
                of
                {item.data.ordersGoalInO}⦿ Goal
              </p>
            </div>
            <div class="w-1/2 p-2 mx-auto text-center">
              <h2
                class="text-3xl font-medium text-primary title-font sm:text-4xl">
                {item.data.backers}
              </h2>
              <p class="text-xs leading-relaxed">
                of
                {item.data.backersGoal}
                Omo Sapiens
              </p>
            </div>
          </div>
        </div>
      </section>
      <div class="bg-light-200">
        <div class="w-1/12 py-1 rounded-r-xl bg-action">
          <div
            class="inline-block px-2 text-sm text-white bg-action rounded-xl">
            {item.data.progressInPercent}
          </div>
        </div>
      </div>
      <div
        class="flex items-center w-full p-4 border-t bg-gray-50 border-light-200">
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
            {item.data.offeredBy.location}
            | estimated delivery in
            {item.data.offeredBy.delivery}
          </div>
        </div>
      </div>

      <div class="w-full">
        <a
          href="https://discord.gg/YedewwChD9"
          class="flex items-center justify-center p-4 text-base font-medium leading-5 text-center text-white border-t border-light-200 rounded-b-xl bg-secondary">
          <div class="flex">
            <p class="mr-1 font-bold lowercase">Pre-Order Now</p>
            <Icon icon={faRocket} />
          </div>
        </a>
      </div>
    </div>
  {/each}
</div>

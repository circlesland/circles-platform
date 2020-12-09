<script>
  import Button from "src/libs/o-views/atoms/Button.svelte";
</script>

<section class="pt-12 overflow-y-scroll bg-white text-light-500">
  <div class="mx-auto">
    <div class="flex flex-col items-center w-full max-w-6xl px-5 py-24 mx-auto">
      <h2
        class="my-5 text-base font-bold tracking-tight uppercase text-tertiary font-title">
        Featured Projects
      </h2>
      <h3
        class="max-w-4xl px-5 mt-2 text-4xl font-black leading-tight text-center text-primary sm:mt-0 sm:px-0 md:text-5xl">
        Crowdfund your future economy one project a time
      </h3>
    </div>
    <div
      class="flex flex-wrap mx-auto my-20 bg-white border rounded-xl border-light-200 lg:max-w-6xl">
      <img
        alt="ondria"
        class="object-cover object-center w-full rounded h-96 lg:w-1/2 lg:h-auto"
        src="./images/market/pflanzenstoff.png" />
      <div class="w-full p-12 md:p-16 lg:w-1/2">
        <h2 class="text-sm tracking-widest text-light-500 title-font">FOOD</h2>
        <h1 class="mb-1 text-3xl font-medium text-primary title-font">
          Pflanzenstoff (6er Pack)
        </h1>
        <div class="leading-relaxed text-light-500">
          <span class="text-2xl font-bold text-light-500 font-primary">
            Activate the powerplants of your body cells</span>
          <p class="pt-2">
            Pflanzenstoff's superfruits can support your concentration, stamina
            and your mental and bodily health. A vegan fruit and vegetable drink
            with just 2.5g sugar. It tastes lively and refreshing with its
            natural only superfood incredients; Acerola, Aronia, Assai,
            Blackberries, Curcumin, Gojibeeren, Pomoegranate, Green Tea, Ginger,
            Carot, Mangosteen, Oranges, Beetroot and Grapes.
          </p>
        </div>
        <div class="pt-2 pb-1 text-4xl font-bold text-primary font-primary">
          <div class="flex items-center">
            450
            <img src="symbols/o.svg" alt="o" class="w-4 h-4 pl-1" />
          </div>
          <div class="py-1 text-base font-bold uppercase text-light-500">
            of 300.000 ⦿ GOAL
          </div>
        </div>
        <div class="pt-2 pb-1 text-4xl font-bold text-primary font-primary">
          <div class="flex items-center">3</div>
          <div class="py-1 text-base font-bold uppercase text-light-500">
            backers of 2000
          </div>
        </div>
        <div class="pt-2 pb-1 text-4xl font-bold text-primary font-primary">
          <div class="flex items-center">120</div>
          <div class="py-1 text-base font-bold uppercase text-light-500">
            days to go
          </div>
        </div>
        <div class="mt-4 rounded-xl bg-light-200">
          <div class="w-1/12 py-1 mt-2 rounded-xl bg-action">
            <div
              class="inline-block px-2 text-sm text-white bg-action rounded-xl">
              1%
            </div>
          </div>
        </div>
        <div class="flex py-4 text-light-500 ">
          <div>
            <img
              src="./images/users/samuel.jpg"
              alt="user"
              class="w-12 h-12 rounded-xl" />
          </div>
          <div class="flex-1 px-4">
            <a
              href="https://discord.gg/YedewwChD9"
              class="font-sans text-base font-bold text-primary font-primary">
              Samuel Andert
              <br />
              <span class="text-sm font-bold text-light-500">Munich, Germany
              </span>
            </a>
          </div>
        </div>
        <a href="https://discord.gg/YedewwChD9" class="w-12 h-12">
          <Button
            mapping={{ data: { label: 'Pre-Order 6-Pack for 150 ⦿' }, design: { type: 'primary' } }} />
        </a>
      </div>
    </div>
    <a href="https://discord.gg/YedewwChD9">
      <button
        class="flex px-4 py-1 mx-auto mt-16 text-base font-bold lowercase bg-white border text-primary border-secondary rounded-xl focus:outline-none hover:text-white hover:bg-secondary-lighter">Start
        new crowdfunding project
      </button>
    </a>
  </div>
</section>

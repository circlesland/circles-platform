<script lang="ts">
  import Menu from "./../../components/Menu.svelte";
</script>

<div
  class="flex flex-col items-center justify-center h-full bg-white bg-center bg-cover"
  style="background-image: url(/images/background.webp)">
  <div
    class="justify-center w-full h-full max-w-lg bg-white shadow-2xl wrap md:m-12"
    style="position:relative;max-height: 900px">
    <div class="h-full">
      <div
        class="flex items-center justify-center mx-4 mt-4 mb-2 text-5xl font-bold text-center text-white border border-gray-200 rounded bg-primary">
        <!-- <p class="py-12 text-gray-100 uppercase font-title">
      {viewModel.circlesBalance}
      ø
    </p> -->
      </div>
      transactions
      <main class="h-full overflow-y-scroll bg-gray-100">
        <!-- {#each viewModel.transactions as t}
      <div class="mx-4 mb-2">
        <div class="flex w-full bg-white border border-gray-300 rounded">
          <div class="flex-1 px-4 py-2 text-base">
            <b
              class="text-primary">{t.direction === 'in' ? 'Incoming' : 'Outgoing'}
              {t.subject}</b>
            <p class="-mt-1 text-xs text-gray-500">
              {t.createdAt}
              ago from
              {t.from}
            </p>
          </div>
          <div
            class="h-12 px-3 py-1 text-3xl text-green-500"
            class:saldo={t.amount < 0}>
            {t.amount}
          </div>
        </div>
      </div>
    {/each}-->
        <Menu />
      </main>
    </div>
  </div>
</div>

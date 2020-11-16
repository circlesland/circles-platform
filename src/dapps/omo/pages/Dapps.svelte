<script lang="ts">
  import TemplateDapp from "src/libs/o-views/templates/TemplateDapps.svelte";
  import { _ } from "svelte-i18n";
  import Navigation from "../components/Navigation.svelte";
  import { onMount } from "svelte";

  let address: string;

  onMount(() => {
    address = localStorage.getItem("omo.safeAddress");
  });
</script>

<TemplateDapp>
  <header slot="header">
    <div
      class="flex items-center justify-center h-full p-4 text-4xl font-bold text-center text-white bg-primary">
      <div>
        {#if address}
          <img
            src="https://avatars.dicebear.com/api/avataaars/omo.svg"
            class="w-32 h-32 mx-auto mt-6 bg-white border-4 rounded-full border-light-300"
            alt="name" />
        {/if}

        <div class="py-2 text-4xl font-title">
          <div class="text-2xl">
            {#if address}
              {$_('omo_dashboard_title_loggedIn')}
              Omo
            {:else}{$_('omo_dashboard_title')}{/if}
          </div>

          {#if !address}
            <div class="text-base">
              to unlock your first dapps please register or login
            </div>
          {/if}
        </div>
      </div>
    </div>
  </header>

  <footer slot="footer">
    <Navigation {address} />
  </footer>
  <main slot="main">
    <div class="grid grid-cols-2 gap-2 -mt-4">
      {#if address}
        <a href="#/identity/settings">
          <div
            class="flex items-center justify-center h-48 p-8 text-center text-gray-800 bg-white border border-gray-200 rounded">
            <div class="text-primary">
              <i class="text-5xl fas fa-user-astronaut" />
              <p class="pt-3">{$_('omo_name_identity')}</p>
              <span
                class="px-2 py-1 text-xs text-blue-200 rounded-full bg-secondary">{$_('omo_alpha_testing')}</span>
            </div>
          </div>
        </a>

        <a href="#/wallet/connect">
          <div
            class="flex items-center justify-center h-48 p-6 text-center text-gray-800 bg-white border border-gray-200 rounded">
            <div class="text-primary">
              <i class="text-5xl fas fa-piggy-bank" />
              <p class="pt-3">{$_('omo_name_wallet')}</p>
              <span
                class="px-2 py-1 text-xs text-blue-200 rounded-full bg-secondary">{$_('omo_alpha_testing')}</span>
            </div>
          </div>
        </a>
      {:else}
        <div>
          <div
            class="flex items-center justify-center h-48 p-6 text-center text-gray-400 bg-white border border-gray-200 rounded">
            <div class="text-gray-500">
              <i class="text-5xl fas fa-comments" />
              <p class="pt-3">{$_('omo_name_identity')}</p>
              <span class="text-xs">({$_('omo_login_to_unlock')})</span>
            </div>
          </div>
        </div>

        <div>
          <div
            class="flex items-center justify-center h-48 p-6 text-center text-gray-400 bg-white border border-gray-200 rounded">
            <div class="text-gray-500">
              <i class="text-5xl fas fa-comments" />
              <p class="pt-3">{$_('omo_name_wallet')}</p>
              <span class="text-xs">({$_('omo_login_to_unlock')})</span>
            </div>
          </div>
        </div>
      {/if}
      <div>
        <div
          class="flex items-center justify-center h-48 p-6 text-center text-gray-400 bg-white border border-gray-200 rounded">
          <div class="text-gray-500">
            <i class="text-5xl fas fa-comments" />
            <p class="pt-3">{$_('omo_name_talk')}</p>
            <span class="text-xs">({$_('omo_coming_soon')})</span>
          </div>
        </div>
      </div>
      <div>
        <div
          class="flex items-center justify-center h-48 p-6 text-center text-gray-400 bg-white border border-gray-200 rounded">
          <div class="text-gray-500">
            <i class="text-5xl fas fa-store" />
            <p class="pt-3">{$_('omo_name_market')}</p>
            <span class="text-xs">({$_('omo_coming_soon')})</span>
          </div>
        </div>
      </div>
      <div>
        <div
          class="flex items-center justify-center h-48 p-6 text-center text-gray-400 bg-white border border-gray-200 rounded">
          <div class="text-gray-500">
            <i class="text-5xl fas fa-user-friends" />
            <p class="pt-3">{$_('omo_name_teams')}</p>
            <span class="text-xs">({$_('omo_coming_soon')})</span>
          </div>
        </div>
      </div>
      <div>
        <div
          class="flex items-center justify-center h-48 p-6 text-center text-gray-400 bg-white border border-gray-200 rounded">
          <div class="text-gray-500">
            <i class="text-5xl fas fa-film" />
            <p class="pt-3">{$_('omo_name_movies')}</p>
            <span class="text-xs">({$_('omo_coming_soon')})</span>
          </div>
        </div>
      </div>
      <div>
        <div
          class="flex items-center justify-center h-48 p-6 text-center text-gray-400 bg-white border border-gray-200 rounded">
          <div class="text-gray-500">
            <i class="text-5xl fas fa-headphones" />
            <p class="pt-3">{$_('omo_name_music')}</p>
            <span class="text-xs">({$_('omo_coming_soon')})</span>
          </div>
        </div>
      </div>
      <div>
        <div
          class="flex items-center justify-center h-48 p-6 text-center text-gray-400 bg-white border border-gray-200 rounded">
          <div class="text-gray-500">
            <i class="text-5xl fas fa-book" />
            <p class="pt-3">{$_('omo_name_books')}</p>
            <span class="text-xs">({$_('omo_coming_soon')})</span>
          </div>
        </div>
      </div>
    </div>
  </main>
</TemplateDapp>

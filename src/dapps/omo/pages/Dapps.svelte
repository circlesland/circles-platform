<script>
  import TemplateDapp from "src/libs/o-views/templates/TemplateDapps.svelte";
  import { _ } from "svelte-i18n";
</script>

<TemplateDapp>
  <header slot="header">
    <div
      class="flex items-center justify-center h-full text-4xl font-bold text-center bg-white border rounded border-light-200 text-primary">
      <div>
        <!-- <img
                src="/images/"
                class="w-32 h-32 mx-auto mt-6 border-4 rounded-full border-light-300"
                alt="name" /> -->
        <p class="py-6 text-lg uppercase font-title">
          <span class="text-4xl">{$_('omo_dashboard_title')}</span>
        </p>
      </div>
    </div>
  </header>
  <main slot="main">
    <div class="grid grid-cols-2 gap-2 -mt-4">
      <a href="#/identity/settings">
        <div
          class="flex items-center justify-center h-48 p-8 text-center text-gray-800 bg-white border border-gray-200 rounded">
          <div class="text-primary">
            <i class="text-5xl fas fa-user-astronaut" />
            <p class="pt-3">{$_('omo_dapp_name_identity')}</p>
            <span
              class="px-2 py-1 text-xs text-blue-200 rounded-full bg-secondary">{$_('omo_dapp_alpha_testing')}</span>
          </div>
        </div>
      </a>

      <a href="#/wallet/connect">
        <div
          class="flex items-center justify-center h-48 p-6 text-center text-gray-800 bg-white border border-gray-200 rounded">
          <div class="text-primary">
            <i class="text-5xl fas fa-piggy-bank" />
            <p class="pt-3">{$_('omo_dapp_name_wallet')}</p>
            <span
              class="px-2 py-1 text-xs text-blue-200 rounded-full bg-secondary">{$_('omo_dapp_alpha_testing')}</span>
          </div>
        </div>
      </a>

      <div>
        <div
          class="flex items-center justify-center h-48 p-6 text-center text-gray-400 bg-white border border-gray-200 rounded">
          <div class="text-gray-500">
            <i class="text-5xl fas fa-comments" />
            <p class="pt-3">{$_('omo_dapp_name_talk')}</p>
            <span class="text-xs">({$_('omo_dapp_coming_soon')})</span>
          </div>
        </div>
      </div>
      <div>
        <div
          class="flex items-center justify-center h-48 p-6 text-center text-gray-400 bg-white border border-gray-200 rounded">
          <div class="text-gray-500">
            <i class="text-5xl fas fa-store" />
            <p class="pt-3">{$_('omo_dapp_name_market')}</p>
            <span class="text-xs">({$_('omo_dapp_coming_soon')})</span>
          </div>
        </div>
      </div>
      <div>
        <div
          class="flex items-center justify-center h-48 p-6 text-center text-gray-400 bg-white border border-gray-200 rounded">
          <div class="text-gray-500">
            <i class="text-5xl fas fa-user-friends" />
            <p class="pt-3">{$_('omo_dapp_name_teams')}</p>
            <span class="text-xs">({$_('omo_dapp_coming_soon')})</span>
          </div>
        </div>
      </div>
      <div>
        <div
          class="flex items-center justify-center h-48 p-6 text-center text-gray-400 bg-white border border-gray-200 rounded">
          <div class="text-gray-500">
            <i class="text-5xl fas fa-film" />
            <p class="pt-3">{$_('omo_dapp_name_movies')}</p>
            <span class="text-xs">({$_('omo_dapp_coming_soon')})</span>
          </div>
        </div>
      </div>
      <div>
        <div
          class="flex items-center justify-center h-48 p-6 text-center text-gray-400 bg-white border border-gray-200 rounded">
          <div class="text-gray-500">
            <i class="text-5xl fas fa-headphones" />
            <p class="pt-3">{$_('omo_dapp_name_music')}</p>
            <span class="text-xs">({$_('omo_dapp_coming_soon')})</span>
          </div>
        </div>
      </div>
      <div>
        <div
          class="flex items-center justify-center h-48 p-6 text-center text-gray-400 bg-white border border-gray-200 rounded">
          <div class="text-gray-500">
            <i class="text-5xl fas fa-book" />
            <p class="pt-3">{$_('omo_dapp_name_books')}</p>
            <span class="text-xs">({$_('omo_dapp_coming_soon')})</span>
          </div>
        </div>
      </div>
      <div>
        <div
          class="flex items-center justify-center h-48 p-6 text-center text-gray-400 bg-white border border-gray-200 rounded">
          <div class="text-gray-500">
            <i class="text-5xl fas fa-file-alt" />
            <p class="pt-3">{$_('omo_dapp_name_files')}</p>
            <span class="text-xs">({$_('omo_dapp_coming_soon')})</span>
          </div>
        </div>
      </div>
    </div>
  </main>
</TemplateDapp>

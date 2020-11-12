<script>
  import { _ } from "svelte-i18n";
</script>

<div class="flex items-center justify-center h-full">
  <div class="mx-auto text-center">
    <img src="images/logo_with_font.png" alt="omo" class="w-40 mx-auto" />
    <br />
    <p class="px-4 py-2 border rounded border-primary text-primary font-title">
      <a href="#/omo/dapps">{$_('button_gotoapp')}</a>
    </p>
  </div>
</div>

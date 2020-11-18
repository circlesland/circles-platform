<script>
  import { _ } from "svelte-i18n";

  let notes_en = {
    notes_text:
      "This dapp is an early alpha test version. For wishes and feedback join our",
    notes_button: "chat",
  };
  let notes_de = {
    notes_text:
      "Diese App is noch in früher Testphase. Für Wünsche und Anregungen schreib uns im",
    notes_button: "Chat",
  };
</script>

<div class="w-full bg-info">
  <div
    href="https://discord.gg/Rbhy4j9"
    class="w-full p-2 text-xs text-yellow-800 ">
    {$_('notes_text')}
    <span
      class="px-2 py-1 font-bold text-orange-800 uppercase bg-orange-400 rounded">
      {$_('notes_button')}
    </span>
  </div>
</div>

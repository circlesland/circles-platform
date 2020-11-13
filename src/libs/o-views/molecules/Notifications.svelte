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

<a
  href="https://discord.gg/Rbhy4j9"
  class="p-2 text-xs text-white text-blue-300 bg-secondary">
  {$_('notes_text')}
  <span class="text-white uppercase rounded ">-- {$_('notes_button')} -- </span>
</a>

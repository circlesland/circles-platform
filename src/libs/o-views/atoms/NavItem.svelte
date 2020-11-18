<script lang="ts">
  export let text: string = "Link";
  export let icon: string = "home";
</script>

<div
  class="flex items-center justify-center w-16 px-2 text-xs text-center hover:text-secondary-lighter">
  <span>
    <i class="text-2xl fas fa-{icon}" />
    <p class="lowercase font-title">{text}</p></span>
</div>

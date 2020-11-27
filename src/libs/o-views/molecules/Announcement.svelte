<script lang="ts">
  interface Announcement {
    data: {
      text: string;
      button: string;
    };
    action: {
      link: string;
    };
  }
  export let mapping: Announcement;
</script>

<a
  href={mapping.action.link}
  class="w-full p-2 text-xs text-white bg-secondary ">
  {mapping.data.text}
  <span
    class="px-2 py-1 font-bold uppercase rounded text-action bg-secondary-lighter">
    -
    {mapping.data.button}
    -
  </span>
</a>

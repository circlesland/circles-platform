<script lang="ts">
  import { Announcement } from "./../interfaces/molecules";

  export let mapping: Announcement;
</script>

<a
  href={mapping.action.link}
  class="w-full text-center whitespace-no-wrap rounded-xl ">
  <div
    class="inline-flex w-full overflow-hidden bg-white md:rounded-xl md:shadow-sm">
    <div class="flex items-center justify-center w-16 p-2 bg-info ">
      <svg
        class="w-6 h-6 text-white fill-current"
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z" />
      </svg>
    </div>
    <div
      class="flex items-center w-full px-3 text-left md:py-1 md:border-t md:border-r rounded-r-xl md:border-b md:border-gray-200">
      <div>
        <span
          class="hidden text-sm font-semibold text-info-darker md:block">Attention</span>
        <p class="leading-none text-xxs text-info-darker md:text-xs">
          {mapping.data.text}
          ->
          {mapping.data.button}
        </p>
      </div>
    </div>
  </div>
</a>

<script lang="ts">
  import Button from "../atoms/Button.svelte";
</script>

<div class="flex items-end justify-center w-full h-full">
  <div>
    <div class="m-6 text-xl uppercase text-primary font-title text-bold">
      page not found
    </div>
    <div class="flex justify-center ">
      <a href="#/omoli/dapps">
        <Button
          mapping={{ data: { label: 'Back to home' }, design: { type: 'secondary' } }} />
      </a>
    </div>
  </div>
</div>

<script>
  import Button from "src/libs/o-views/atoms/Button.svelte";
</script>

<style>
  .video {
    height: 700px;
  }
</style>

<div class="my-20 text-white bg-white">.</div>
<div
  class="flex items-center justify-center m-12 video bg-light-200 rounded-xl borer border-light-300">
  <div>
    <div class="my-4">Video Placeholder (coming soon)</div>
    <a href="#/lightpaper" class="my-4">
      <Button
        mapping={{ data: { label: 'Read the lightpaper instead' }, design: { type: 'secondary' } }} />
    </a>
  </div>
</div>

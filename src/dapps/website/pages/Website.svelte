<script>
  import "css-doodle";
  import { _ } from "svelte-i18n";
</script>

<style>
  :root {
    --bg: #051626;
  }
</style>

<div class="absolute z-10 flex items-center justify-center w-full h-full ">
  <div>
    <img src="images/logo/logo_light.svg" alt="omo" class="w-16 pb-6 mx-auto" />
  </div>
</div>

<div class="absolute z-10 flex items-end justify-center w-full h-full py-16">
  <div>
    <div class="text-2xl text-white font-title">empowering your abundance</div>
    <div class="flex justify-center pt-8">
      <a
        href="#/omo/dapps"
        class="px-4 py-2 text-center text-white uppercase border-2 border-white rounded">{$_('button_gotoapp')}</a>
    </div>
  </div>
</div>

<div class="z-0 flex items-center justify-center w-full h-full bg-dark">
  <css-doodle>
    {`
    :doodle {
        @grid: 8x1 / 50vmin;
      }
    
      @size: calc(100% - @i() * 3%);
      @place-cell: center;
      @shape: heart;
      overflow: hidden;
      
      :after {
        content: '';
        @size: calc(100% - 5px);
        @shape: heart;
        background: var(--bg);
        z-index: 1;
      }
    
      :before {
        content: '';
        position: absolute;
        @size: 200%;
        background: conic-gradient(
          @pd(#78E7D4, #E3383F, #EFF4DD, #F2A341) @p(10%, 40%),
          transparent 0
        );
        animation: cycle @r(3s, 5s, .1) linear infinite;
        animation-delay: -@r(8s);
        z-index: 0;
      }
    
      @keyframes cycle {
        to { transform: rotate(1turn); }
      }
      `}
  </css-doodle>
</div>

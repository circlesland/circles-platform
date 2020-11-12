<script>
  import "css-doodle";
  import Notifications from "src/libs/o-views/molecules/Notifications.svelte";
</script>

<style>
  :global(css-doodle) {
    margin: auto;
  }
  .dapp {
    display: grid;
    grid-template-rows: auto 1fr;
    max-height: 900px;
  }
</style>

<div
  class="z-10 flex flex-col items-center justify-center h-full overflow-hidden bg-center bg-cover">
  <div
    class="flex items-center justify-center w-full h-full max-w-lg overflow-hidden wrap">
    <div class="w-full h-full overflow-hidden dapp">
      <Notifications />
      <slot>
        <p>Dapp Screen</p>
      </slot>
    </div>
  </div>
</div>

<div
  class="absolute z-0 flex items-center justify-center w-full h-full position bg-dark">
  <css-doodle>
    {`
    
      :doodle { 
        @grid: 1x15 / 61.8vmin; 
      }
    
      @place-cell: center; 
      @size: calc(@index() * 10%);
      
      border-radius: 50%;
      border-style: dashed;
      border-width: calc(@index() * 1vmin); 
      border-color: hsla(
        calc(20 * @index()), 75%, 70%, 
        calc(3 / @index() * .5)
      );
      
      --d: @rand(20s, 40s); 
      --rf: @rand(360deg);
      --rt: calc(var(--rf) + @pick(1turn, -1turn));
    
      animation: spin var(--d) linear infinite;
      @keyframes spin {
        from { transform: rotate(var(--rf)) }
        to   { transform: rotate(var(--rt)) }
      }
    
    `}
  </css-doodle>
</div>

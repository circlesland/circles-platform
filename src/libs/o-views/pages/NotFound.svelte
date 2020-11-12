<script>
  import "css-doodle";
</script>

<style>
  :root {
    --bg: #051626;
  }
</style>

<div
  class="absolute flex items-end justify-center w-full h-full py-16 z-100 bg-dark">
  <div>
    <div class="m-6 text-xl text-white uppercase font-title text-bold">
      page not found
    </div>
    <div class="flex justify-center ">
      <a
        href="/"
        class="px-4 py-2 text-center text-white uppercase border-2 border-white rounded">go
        back to home</a>
    </div>
  </div>
</div>
<div class="flex items-center justify-center w-full h-full z-1100">
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

<script>
  import "@fortawesome/fontawesome-free/js/all.js";
</script>

<style global>
  @import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@300;500;700&display=swap");
  @import url("https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;500;700&display=swap");
  /* @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300&display=swap");
  @import url("https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"); */

  @tailwind base;
  @tailwind utilities;
  @tailwind components;

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-user-drag: none;
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  }
  html,
  body {
    height: 100%;
    width: 100%;
    overflow: hidden !important;
    position: relative;
    touch-action: none;
  }
</style>

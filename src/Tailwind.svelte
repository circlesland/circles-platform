<script>
  import "@fortawesome/fontawesome-free/js/all.js";
</script>

<style global>
  @import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@500&display=swap");
  @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap");
  @import url("https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

  @tailwind base;
  @tailwind utilities;
  @tailwind components;

  html {
    height: -webkit-fill-available;
  }
  body {
    min-height: 100vh;
    /* mobile viewport bug fix */
    min-height: -webkit-fill-available;
    overflow: hidden;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    @apply font-sans;
  }
</style>

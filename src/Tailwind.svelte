<script>
  import "@fortawesome/fontawesome-free/js/all.js";
  // import { lock, unlock } from "html-body-scroll-lock";

  // const targetElement = document.querySelector("body");

  // lock(targetElement);
</script>

<style global>
  @import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@500&display=swap");
  @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300&display=swap");
  @import url("https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

  @tailwind base;
  @tailwind utilities;
  @tailwind components;

  /* html {
    height: -webkit-fill-available;
  } */

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-user-drag: none;
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    -webkit-overflow-scrolling: touch;
  }
  html,
  body {
    height: 100vh;
    width: 100vh;
    overflow: hidden !important;
    position: fixed;
    -webkit-backface-visibility: hidden;
    height: -webkit-fill-available;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    padding: 0;
  }
</style>

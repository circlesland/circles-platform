<script lang="ts">
    import Router from 'svelte-spa-router'
    import Home from "./dapps/Home.svelte";
    import Dapps from "./dapps/Dapps.svelte";
    import Wallet from "./dapps/Wallet.svelte";
    import Error404 from "./dapps/Error404.svelte";

    const routes = {
        '/': Home,
        '/home:': Home,
        '/dapps:': Dapps,
        '/wallet': Wallet,
    }
</script>

<style global>
    @import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@500&display=swap");
    @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap");
    @import url("https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

    @tailwind base;
    @tailwind utilities;
    @tailwind components;

    html,
    body {
        height: 100%;
        overflow: hidden;
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
</style>

<main class="h-full p-12 font-sans text-center text-white bg-primary">
    <Router {routes}/>
</main>

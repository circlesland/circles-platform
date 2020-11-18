<script lang="ts">
    import NavItem from "../atoms/NavItem.svelte";
    import {link} from "svelte-spa-router";
    import active from "svelte-spa-router/active";
    import {createEventDispatcher} from "svelte";
    import {ActionBarAction} from "../../../routes";

    const dispatch = createEventDispatcher();
    export let quickActions: ActionBarAction[] = [];


    function onActionButtonClick() {
        dispatch("actionButtonClick");
    }

</script>

<style>
    :global(a.active) {
        color: #0d49a3;
    }
</style>
<button class="absolute flex items-center justify-center w-full text-center action"
        on:click={onActionButtonClick}>
    <div class="fixed w-16 h-16 mx-auto mt-6 text-white border rounded-full border-light-100 action bg-secondary hover:bg-secondary-lighter">
        <i class="mt-4 text-3xl fas fa-plus "/>
    </div>
</button>

<footer class="flex justify-between px-4 pt-3 pb-2 text-gray-400 bg-white border-t border-gray-300">

    <a href="{quickActions[0].route}">
        <NavItem icon="{quickActions[0].icon}" text="{quickActions[0].label}"/>
    </a>

    <a href="{quickActions[1].route}">
        <NavItem icon="{quickActions[1].icon}" text="{quickActions[1].label}"/>
    </a>

    <a href="{quickActions[2].route}">
        <NavItem icon="{quickActions[2].icon}" text="{quickActions[2].label}"/>
    </a>

    <a href="{quickActions[3].route}">
        <NavItem icon="{quickActions[3].icon}" text="{quickActions[3].label}"/>
    </a>
</footer>

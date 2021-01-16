<script lang="ts">
  import Icon from "fa-svelte";
  import {faChevronDown} from "@fortawesome/free-solid-svg-icons";
  import {faChevronRight} from "@fortawesome/free-solid-svg-icons";
  import {faFolder} from "@fortawesome/free-solid-svg-icons";
  import {faFile} from "@fortawesome/free-solid-svg-icons";
  import Menu from "./Menu.svelte";
  import MenuOption from "./MenuOptions.svelte";
  import { Jumper } from "svelte-loading-spinners";
  import {FsNode} from "../../nodes/fsNode";
  import {createEventDispatcher} from "svelte";
  import {OmoSubscription} from "omo-quirks/dist/OmoSubscription";

  const dispatcher = createEventDispatcher();

  export let treeNode: FsNode;
  export let level: number = 0;

  let title: string = "...";
  let icon: string = "box";
  let working: boolean = false;

  let isExpanded: boolean = false;
  let isSelected: boolean = false;
  let sub: OmoSubscription;

  $:{
    title = treeNode.title;
    icon = treeNode.icon;

    if (sub)
    {
      sub.unsubscribe();
      sub = null;
    }
  }

  async function onExpandIndicatorClick(e)
  {
    if (e)
    {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!isExpanded)
    {
      console.log("Node: onExpand()");
      await treeNode.onExpand();
    }
    else
    {
      console.log("Node: onCollapse()");
      await treeNode.onCollapse()
    }

    isExpanded = !isExpanded;
  }

  async function reload() {
    isExpanded = true;
    await onExpandIndicatorClick(null);
    await onExpandIndicatorClick(null);
  }

  function onItemClick(e:MouseEvent)
  {
    if (e.button == 1)
    {
      openMenu(e)
    }
  }

  function onItemDblClick(e)
  {
    onExpandIndicatorClick(e)
  }

  let pos = { x: 0, y: 0 };
  let showMenu = false;

  function openMenu(e)
  {
    if (working)
      return;

    e.preventDefault();
    e.stopPropagation();

    pos = { x: e.clientX, y: e.clientY };
    showMenu = true;
  }

  async function onDelete()
  {
    working = true;
    await treeNode.delete();

    if (treeNode.parent)
    {
      dispatcher("reloadParent");
    }

    working = false;
  }
</script>

<span class="flex p-1 hover:bg-green-200 dark-hover:bg-green-500"
      style={`padding-left: ${isSelected ? level - 1 : level}em; ${isSelected ? 'border-left: solid 1em #ddd': ''}`}
      on:contextmenu|preventDefault={openMenu}
      on:click={onItemClick}
      on:dblclick={onItemDblClick}>

    <!-- Expand/Collapse indicator -->
  {#if treeNode.type === "directory"}
    {#if isExpanded}
        <span on:click={onExpandIndicatorClick} class="inline-block w-8 h-6 max-w-8">
          <Icon icon={faChevronDown}></Icon>
        </span>
    {:else}
        <span on:click={onExpandIndicatorClick} class="text-gray-400 inline-block w-8 h-6 max-w-8">
            <Icon icon={faChevronRight}></Icon>
        </span>
    {/if}
  {:else}
        <span class="text-gray-400 inline-block w-8 h-6 max-w-8">
        </span>
  {/if}

  <!-- Entity icon -->
    <span class="inline-block w-6 h-6 max-w-6 max-h-6" on:click={onItemClick}>
      {#if working}
        <Jumper size="24" color="#071D69" unit="px" /><br />
      {:else}
        {#if treeNode.type === "directory"}
          <span on:click={onExpandIndicatorClick} class="inline-block w-8 h-6 max-w-8">
            <Icon icon={faFolder}></Icon>
          </span>
        {:else}
          <span on:click={onExpandIndicatorClick} class="text-gray-400 inline-block w-8 h-6 max-w-8">
              <Icon icon={faFile}></Icon>
          </span>
        {/if}
      {/if}
    </span>

  <!-- Label -->
  {#if isSelected}
        <span class="text ml-1"><b>{title}</b></span>
  {:else}
      <span class="text ml-1">{title}</span>
  {/if}
</span>

{#if isExpanded && treeNode && treeNode.childNodes.length > 0}
  <ul>
    {#each treeNode.childNodes as childNode}
      <svelte:self on:reloadParent={reload} treeNode={childNode} level={level + 1}/>
    {/each}
  </ul>
{/if}


{#if showMenu}
  <Menu {...pos} on:click={() => showMenu = false} on:clickoutside={() => showMenu = false}>
    <MenuOption
      on:click={() => onDelete()}
      text="Delete" />
    <!--<MenuOption
      on:click={console.log}
      text="Do nothing, but twice" />
    <MenuDivider />
    <MenuOption
      isDisabled={true}
      on:click={console.log}
      text="Whoops, disabled!" />
    <MenuOption on:click={console.log}>
      <span>Look! An icon!</span>
    </MenuOption>-->
  </Menu>
{/if}


<script lang="ts">
  import {OpenStreetMapProvider} from "leaflet-geosearch";
  import TypeaheadAlike from "./svelte-typeahead/TypeaheadAlike.svelte";
  import {DelayedTrigger} from "../../o-os/delayedTrigger";
  import {ProcessArtifact} from "../../o-processes/interfaces/processArtifact";
  import {createEventDispatcher, onMount} from "svelte";

  const provider = new OpenStreetMapProvider();
  export let processArtifact: ProcessArtifact;
  const dispatch = createEventDispatcher();

  interface Place {
    boundingbox: string[],
    class: string,
    display_name: string,
    lat: string,
    lon: string,
    place_id: number
    osm_id: number
    osm_type: string
  }

  let searchText: string = "";
  let locations:Place[] = [];

  let delayedTrigger = new DelayedTrigger(200, async () => {
    const results = await provider.search({query: searchText});
    const places = results.filter(function (place)
    {
      return (
        place.raw.type === "administrative" ||
        place.raw.type === "city" ||
        place.raw.type === "county" ||
        place.raw.type === "town" ||
        place.raw.type === "village"
      );
    });

    locations = places.map(o => {
      return {
        ...o.raw
      }
    });
  });

  async function geoSearch(query:string)
  {
    if (searchText.length < 3)
    {
      locations = [<any>{
        display_name: "Type at least 3 characters to start the search .."
      }];
      return;
    }

    locations = [<any>{
      display_name: "Searching .."
    }];
    searchText = query;
    delayedTrigger.trigger();
  }

  let placeName: string = "";

  onMount(() => {
    if (processArtifact.value && processArtifact.value.display_name)
    {
      searchText = processArtifact.value.display_name;
    }
  })
</script>

{#if !processArtifact.isReadonly}
<TypeaheadAlike
  placeholder={`Search for contacts or enter an address`}
  hideLabel
  data={locations}
  format={(original) => original.display_name}
  let:result
  let:index
  on:input={(e) => {
    console.log("onInput:", e.target.value)
    geoSearch(e.target.value);
  }}
  bind:searchText={searchText}
  bind:value={processArtifact.value}
  on:select="{(e) => {
              processArtifact.value = e.detail.selected;
              dispatch('validate');
          }}"
  on:clear="{() => {
              processArtifact.value = null;
              dispatch('validate');
          }}">
  <div>
    {locations[index].display_name}
  </div>
</TypeaheadAlike>
{:else}
  {processArtifact.value.display_name}
{/if}

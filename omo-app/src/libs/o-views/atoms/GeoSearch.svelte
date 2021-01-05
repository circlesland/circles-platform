<script lang="ts">
  import { OpenStreetMapProvider } from "leaflet-geosearch";
  const provider = new OpenStreetMapProvider();
  async function geoSearch(query) {
    const results = await provider.search({ query: query });
    const places = results.filter(function (place) {
      return (
        place.raw.type === "administrative" ||
        place.raw.type === "city" ||
        place.raw.type === "county" ||
        place.raw.type === "town" ||
        place.raw.type === "village"
      );
    });
    console.log(places);
  }
  let placeName: string = "";
</script>

<!-- This is an example component -->
<div>
  <input type="text" bind:value={placeName} />
  <button on:click={geoSearch(placeName)}>Search</button>
</div>

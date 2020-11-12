<script>
  import Character from "src/dapps/omo-li/components/Character.svelte";
  function fetchCharacters() {
    return fetch("/data/characters.json").then((response) => response.json());
  }
</script>

{#await fetchCharacters()}
  <p>Loading...</p>
{:then characters}
  <div class="columns is-mobile is-multiline">
    {#each characters as character}
      <div class="column is-one-third-desktop is-half-tablet is-full-mobile">
        <Character {character} />
      </div>
    {/each}
  </div>
{:catch error}
  <p>There was a problem loading characters.</p>
{/await}

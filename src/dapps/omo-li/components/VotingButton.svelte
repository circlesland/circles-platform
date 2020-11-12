<script>
  export let count = 0;
  export let type = "up";
</script>

<style>
  .button {
    min-width: 5rem;
  }
  .button-count {
    font-size: 0.9rem;
  }
</style>

<button class="button" on:click>
  <span class="icon"> <span class="far fa-thumbs-{type}" /> </span>

  <span class="button-count">{count}</span>
</button>

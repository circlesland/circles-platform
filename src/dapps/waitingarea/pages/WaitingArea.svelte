<script>
  import LoadingIndicator from "src/libs/o-views/atoms/LoadingIndicator.svelte";
  import {pop, replace} from "svelte-spa-router";

  if (!window.o.redirectTo)
  {
    pop();
  }
  else
  {
    pop();
    replace(window.o.redirectTo);
    window.o.redirectTo = null;
  }

</script>
<LoadingIndicator></LoadingIndicator>

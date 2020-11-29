<script lang="ts">
  import {ProcessArtifact} from "../../../o-processes/interfaces/processArtifact";
  import {createEventDispatcher} from "svelte";

  export let processArtifact: ProcessArtifact;
  const dispatch = createEventDispatcher();

  let files = [];

  $:{
    if (files && files.length > 0)
    {
      for (let i = 0; i < files.length; i++)
      {
        const file = files[i];
        const reader = new FileReader();
        reader.addEventListener('loadend', e => {
          processArtifact.value = reader.result;
          processArtifact.isValid = true;
          dispatch("validated", processArtifact.isValid);
        });
        reader.readAsDataURL(file);
      }
    }
  }
</script>

<input
bind:files
type="file"
accept="image/*">

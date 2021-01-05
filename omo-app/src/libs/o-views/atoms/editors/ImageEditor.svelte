<script lang="ts">
  import { ProcessArtifact } from "../../../o-processes/interfaces/processArtifact";
  import {createEventDispatcher, onMount} from "svelte";
  import Cropper from "js-cropper";

  export let processArtifact: ProcessArtifact;
  const dispatch = createEventDispatcher();

  let files = [];
  let imageData: string;
  let croppedImageData: string;

  $: {
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.addEventListener("loadend", (e) => {
          imageData = reader.result.toString();
        });
        reader.readAsDataURL(file);
      }
    }

    if (cropper && imageData)
    {
      cropper.loadImage(imageData)
    }
  }

  let cropper;

  onMount(() => {
    if (!processArtifact.isReadonly)
    {
      cropper = new Cropper({
        onChange: function (crop)
        {
          croppedImageData = cropper.getCroppedImage();
          processArtifact.value = croppedImageData;
          processArtifact.isValid = true;
          dispatch("validated", processArtifact.isValid);
        }
      });
      cropper.render("#crop");
      cropper.setWidth(512);
      cropper.setHeight(512);
    }
  });

</script>
{#if !processArtifact.isReadonly}
<div id="crop" ></div>
  <input bind:files type="file" accept="image/*" />
{:else}
  <img src={processArtifact.value} />
{/if}

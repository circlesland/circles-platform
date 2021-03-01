<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import Cropper from '../svelte-easy-crop/Cropper.svelte' ;
  import Dropzone from "libs/svelte-dropzone";
  import Icon from "fa-svelte";
  import {faTimes} from "@fortawesome/free-solid-svg-icons";
  import {ProcessArtifact} from "omo-process/dist/interfaces/processArtifact";

  const addedfile = file => {
    const reader = new FileReader();
    reader.addEventListener("loadend", (e) => {
      processArtifact.value = Buffer.from(<ArrayBuffer>reader.result);
      processArtifact.isValid = true;
      dispatch("validated", processArtifact.isValid);

      loadImageIntoCanvas()
    });
    reader.readAsArrayBuffer(file);
  }

  let crop = { x: 0, y: 0 }
  let zoom = 1

  export let processArtifact: ProcessArtifact;
  const dispatch = createEventDispatcher();

  let files = [];

  function clearImage()
  {
    processArtifact.value = null;
    files = [];
  }

  function loadImageIntoCanvas()
  {
    const canvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('cropCanvas');
    const ctx = canvas.getContext('2d');

    const image = new Image();
    image.src = `data:image/*;base64,${processArtifact.value.toString('base64')}`;

    image.onload = function(){
      ctx.drawImage(image,
        70, 20,   // Start at 70/20 pixels from the left and the top of the image (crop),
        50, 50,   // "Get" a `50 * 50` (w * h) area from the source image (crop),
        0, 0,     // Place the result at 0, 0 in the canvas,
        100, 100); // With as width / height: 100 * 100 (scale)
    }
  }

  $: {
    if (processArtifact && processArtifact.value) {
      processArtifact.isValid = true;
      setTimeout(() => {
        dispatch("validated", processArtifact.isValid);
      })
    }
  }

/*
  const itemTemplate = `<div class="dz-preview dz-file-preview">
    <div class="dz-details">
      <!--<div class="dz-filename"><span data-dz-name></span></div>
        <div class="dz-size" data-dz-size></div>-->
        <img data-dz-thumbnail />
      </div>
    </div>`;
 */

</script>
<div style="width:100%; height:100%;">
<!--<input bind:files type="file" accept="image/*" />-->
<canvas style="visibility: hidden; position:absolute; left:-8096px; top:-8096px;" id="cropCanvas" width="300" height="300"></canvas>
{#if processArtifact.value}
  <a on:click={() => clearImage()} style="float: right; cursor: pointer;">
    <Icon icon={faTimes} /> clear
  </a>
  <Cropper
    image={`data:image/png;base64,${processArtifact.value.toString('base64')}`}
    bind:crop
    bind:zoom
    on:cropcomplete={e => console.log(e.detail)}
  />
{:else}
  <Dropzone
    dropzoneClass="dropzone"
    hooveringClass="hooveringClass"
    id="id"
    dropzoneEvents={{ addedfile }}
    options={{ clickable: true, acceptedFiles: 'image/png,image/jpeg,image/jpg', maxFilesize: 1024 * 5 }}>
    <p>Drop files here to upload</p>
  </Dropzone>
{/if}

</div>

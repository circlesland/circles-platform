<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { onMount } from "svelte";
  import Cropper from "../svelte-easy-crop/Cropper.svelte";
  import Dropzone from "libs/svelte-dropzone";
  import Icon from "fa-svelte";
  import { faTimes } from "@fortawesome/free-solid-svg-icons";
  import { ProcessArtifact } from "omo-process/dist/interfaces/processArtifact";

  const dispatch = createEventDispatcher();

  let crop = { x: 0, y: 0 };
  let zoom = 1;
  let aspect = 1 / 1;
  let cropShape = "round";

  let canvas;
  let ctx;
  let image;
  let uploadFile;

  export let processArtifact: ProcessArtifact;

  onMount(async () => {
    canvas = HTMLCanvasElement = <HTMLCanvasElement>(
      document.getElementById("cropCanvas")
    );

    ctx = canvas.getContext("2d");
  });

  const addedfile = (file) => {
    const reader = new FileReader();

    reader.addEventListener("loadend", (e) => {
      uploadFile = Buffer.from(<ArrayBuffer>reader.result);
      loadImageIntoCanvas();
    });

    reader.readAsArrayBuffer(file);
  };

  function clearImage() {
    processArtifact.value = null;
    uploadFile = null;
    image = null;
  }

  function loadImageIntoCanvas() {
    image = new Image();
    image.src = `data:image/*;base64,${uploadFile.toString("base64")}`;

    image.onload = function () {
      ctx.drawImage(
        image,
        70,
        20, // Start at 70/20 pixels from the left and the top of the image (crop),
        50,
        50, // "Get" a `50 * 50` (w * h) area from the source image (crop),
        0,
        0, // Place the result at 0, 0 in the canvas,
        100,
        100
      ); // With as width / height: 100 * 100 (scale)
    };
  }

  function cropImage(cropData) {
    const sourceX = cropData.detail.pixels.x;
    const sourceY = cropData.detail.pixels.y;
    const sourceWidth = cropData.detail.pixels.width;
    const sourceHeight = cropData.detail.pixels.height;
    const destWidth = sourceWidth;
    const destHeight = sourceHeight;
    const destX = canvas.width / 2 - destWidth / 2;
    const destY = canvas.height / 2 - destHeight / 2;
    const mimeType = "image/png";

    ctx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      destX,
      destY,
      destWidth,
      destHeight
    );

    // convert to blob which i'm not sure if actually necessary :D
    canvas.toBlob((blob) => {
      const reader = new FileReader();

      reader.addEventListener("loadend", () => {
        const arrayBuffer = reader.result;
        processArtifact.value = Buffer.from(<ArrayBuffer>reader.result);
        processArtifact.isValid = true;
      });

      reader.readAsArrayBuffer(blob);
    }, mimeType);

    // This kind of happens every time the user 'moves' the cropping tool, maybe this isn't necessary?
    dispatch("validated", processArtifact.isValid);
  }

  $: {
    if (processArtifact && processArtifact.value) {
      processArtifact.isValid = true;
      setTimeout(() => {
        dispatch("validated", processArtifact.isValid);
      });
    }
  }
</script>

<div class="w-full h-full">
  <canvas
    style="visibility: hidden; position:absolute; left:-8096px; top:-8096px;"
    id="cropCanvas"
    width="300"
    height="300"
  />
  {#if uploadFile}
    <div class="relative" style="top: -30px;">
      <span on:click={() => clearImage()} class="float-right cursor-pointer">
        <Icon icon={faTimes} />clear
      </span>
    </div>
    <div class="w-full h-96 relative">
      <Cropper
        image={`data:image/png;base64,${uploadFile.toString("base64")}`}
        bind:crop
        bind:zoom
        bind:aspect
        bind:cropShape
        on:cropcomplete={(cropData) => cropImage(cropData)}
      />
    </div>
  {:else}
    <Dropzone
      dropzoneClass="dropzone"
      hooveringClass="hooveringClass"
      id="id"
      dropzoneEvents={{ addedfile }}
      options={{
        clickable: true,
        acceptedFiles: "image/png,image/jpeg,image/jpg",
        maxFilesize: 1024 * 5,
      }}
    >
      <p>Drop files here to upload</p>
    </Dropzone>
  {/if}
</div>

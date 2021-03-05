<script lang="ts">
  import {IpfsNode} from "omo-indexes/dist/ipfsNode";

  export let cid:string;
  export let mimeType:string;
  export let classes:string;

  let dataUrl:string;
  $: {
    if (cid)
    {
      init();
    }
  }

  async function init()
  {
    dataUrl = await IpfsNode.runWithIPFS(async ipfs =>
    {
      const catIterable = ipfs.cat(cid, {preload:false});
      const chunks = []

      for await (const chunk of catIterable)
      {
        chunks.push(chunk);
      }

      const imageData = Buffer.concat(chunks);
      return `data:${mimeType ?? "image/*"};base64,${imageData.toString('base64')}`;
    });
  }

  init();
</script>
<img src={dataUrl} class={classes} />

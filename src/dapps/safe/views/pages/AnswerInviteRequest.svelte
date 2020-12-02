<script lang="ts">
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import {onMount} from "svelte";
  import {pop} from "svelte-spa-router";
  import {RunProcess} from "../../../../libs/o-events/runProcess";
  import {transferXDai, TransferXDaiContext} from "../../processes/transferXDai/transferXDai";
  import {CloseModal} from "../../../../libs/o-events/closeModal";
  import { Jumper } from "svelte-loading-spinners";
  import {jumpstart, JumpstartContext} from "../../processes/jumpstart/jumpstart";

  export let params: {
    from?:string
  } = {};

  onMount(() => {
    pop();
    window.o.publishEvent(new CloseModal());
    setTimeout(() => {
      window.o.publishEvent(new RunProcess(jumpstart, async (context:JumpstartContext) => {
        context.data.recipient = {
          key: "recipient",
          type: "ethereumAddress",
          isReadonly: true,
          value: params.from
        };
        context.data.value =  {
          key: "value",
          type: "inviteCredits",
          isReadonly: true,
          value: 1
        };
        return context;
      }));
    }, 10);
  })
</script>

<Compose rows="1fr" columns="1fr" overflowY tw="mx-4 mt-4 md:mx-0 md:mt-2">
  <Jumper></Jumper>
</Compose>

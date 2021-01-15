<script lang="ts">
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import {onMount} from "svelte";
  import {pop, push} from "svelte-spa-router";
  import {RunProcess} from "../../../../libs/o-events/runProcess";
  import {CloseModal} from "../../../../libs/o-events/closeModal";
  import { Jumper } from "svelte-loading-spinners";
  import {jumpstart, JumpstartContext} from "../../processes/omo/jumpstart";

  export let params: {
    from?:string
    name?:string
  } = {};

  onMount(() => {
    console.log("document.referrer", document.referrer)
    if (document.referrer.indexOf(window.location.origin) > -1)
    {
      pop();
    }
    else
    {
      push("#/omosapien/profile");
    }

// https://0.0.0.0:5000/#/safe/empowerMe/1234/hansi1599
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
        context.data.foreignProfileFissionName =  {
          key: "foreignProfileFissionName",
          type: "string",
          isReadonly: true,
          value: params.name
        };
        return context;
      }));
    }, 10);
  })
</script>

<Compose rows="1fr" columns="1fr" overflowY tw="mx-4 mt-4 md:mx-0 md:mt-2">
  <div class="flex items-center justify-center">
    <div>
      <Jumper size="150" color="#071D69" unit="px" /><br />
      <div class="text-sm text-center text-primary foont-primary">
        empowering ...
      </div>
    </div>
  </div>
</Compose>

<script lang="ts">
  import {pop, replace} from "svelte-spa-router";
  import {onDestroy, onMount} from "svelte";
  import Compose from "../../../libs/o-views/atoms/Compose.svelte";
  import Mobile from "../../../libs/o-views/templates/Mobile.svelte";
  import { Jumper } from "svelte-loading-spinners";
  import {OmoEvent} from "omo-events/dist/omoEvent";
  import {ProgressSignal} from "omo-events/dist/signals/progressSignal";
  import {OmoSubscription} from "omo-quirks/dist/OmoSubscription";

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

  let progressIndicator: { message: string, percent: number };
  let subscription: OmoSubscription;

  onMount(() =>
  {
    subscription = window.o.events.subscribe((event: OmoEvent) =>
    {
      if (event.type === "shell.begin")
      {
      }
      if (event.type === "shell.done")
      {
        progressIndicator = null;
      }
      if (event.type === "shell.progress")
      {
        const progressEvent: ProgressSignal = <ProgressSignal>event;
        progressIndicator = {
          message: progressEvent.message,
          percent: progressEvent.percent
        }
      }
    });
  });

  onDestroy(() =>
  {
    if (subscription)
      subscription.unsubscribe();
  });

</script>

<Mobile>
  <Compose rows="1fr" columns="1fr" tw="m-4 md:m-0" gap="10px" overflowY>
    <div class="flex items-center justify-center">
      <div>
        <Jumper size="150" color="#071D69" unit="px" /><br />
        {#if progressIndicator}
        <div class="text-sm text-center text-primary foont-primary">
          {progressIndicator.message}
        </div>
        {/if}
      </div>
    </div>
  </Compose>
</Mobile>

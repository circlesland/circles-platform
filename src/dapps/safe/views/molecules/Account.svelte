<script lang="ts">
  import {CirclesHub} from "src/libs/o-circles-protocol/circles/circlesHub";
  import {Person} from "src/libs/o-circles-protocol/model/person";
  import {config} from "src/libs/o-circles-protocol/config";
  import type {Address} from "src/libs/o-circles-protocol/interfaces/address";
  import {onDestroy} from "svelte";
  import {Subscription} from "rxjs";
  import {OmoEvent} from "../../../../libs/o-events/omoEvent";

  let person: Person;
  let mySafeAddress: Address;

  async function init()
  {
    const hubAddress = config.getCurrent().HUB_ADDRESS;
    const circlesHub = new CirclesHub(config.getCurrent().web3(), hubAddress);
    mySafeAddress = (await window.o.safe()).address;
    person = new Person(circlesHub, mySafeAddress);
  }


  let subscription: Subscription = window.o.events.subscribe((event: OmoEvent) =>
    {
      if (event.type === "shell.refreshView")
      {
        init();
      }
    });

  onDestroy(() =>
  {
    if (!subscription)
      return;

    subscription.unsubscribe();
    subscription = null;
  });

  $: {
    init();
  }
</script>

<div class="flex items-center justify-center py-2">
  <p class="px-3 py-1 text-xs text-light-400">Safe: {person.address}</p>
</div>

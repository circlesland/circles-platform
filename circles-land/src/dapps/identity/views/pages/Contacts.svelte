<script lang="ts">
  import CategoryTitle from "../../../../libs/o-views/atoms/CategoryTitle.svelte";
  import {tryGetDappState} from "omo-kernel/dist/kernel";
  import {Contact} from "omo-central/dist/generated";
  import {FissionAuthState} from "omo-fission/dist/manifest";
  import ContactListItem from "../atoms/ContactListItem.svelte";

  const fissionAuth = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  let myContacts: Contact[] = [];

  async function init() {
    fissionAuth.state.omoCentralClientSubject.subscribe(async api => {
      const contacts = await api.queryContacts(fissionAuth.state.username);
      myContacts = contacts.data.contacts;
    });
  }

  init();

  const labelMyOffers = {
    data: {
      label: "My contacts",
    },
  };
</script>

<div>
  <div class="mb-4">
    <CategoryTitle mapping={labelMyOffers} />
  </div>
  <div class="mb-4 space-y-2">
    {#each myContacts as contact}
      <ContactListItem contact={contact} />
    {/each}
  </div>
</div>

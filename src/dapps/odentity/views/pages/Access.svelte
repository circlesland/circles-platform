<script lang="ts">
  import CategoryTitle from "src/libs/o-views/atoms/CategoryTitle.svelte";
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import AccessItem from "src/libs/o-views/molecules/AccessItem.svelte";

  const accessDevices = [
    {
      data: {
        image: "/icons/paperWallet.svg",
        title: "Seedphrase (Paper Wallet)",
        subtitle: "@Home",
      },
    },
    {
      data: {
        image: "/icons/mobileOmo.svg",
        title: "iOS HomeScreen (D)app",
        subtitle: "Samuel's iPhone",
      },
    },
    {
      data: {
        image: "/icons/mobileSafari.svg",
        title: "iOS Safari Browser",
        subtitle: "Samuel's iPhone",
      },
    },
    {
      data: {
        image: "/icons/laptopChrome.svg",
        title: "macOS Chrome Browser",
        subtitle: "Samuel's MacBook",
      },
    },
    {
      data: {
        image: "/icons/laptopFirefox.svg",
        title: "macOS Firefox Browser",
        subtitle: "Samuel's Macbook",
      },
    },
    {
      data: {
        image: "/icons/laptopOmo.svg",
        title: "macOS Desktop D(app)",
        subtitle: "Samuel's Macbook",
      },
    },
  ];

  const accessDapps = [
    {
      data: {
        image: "/icons/dappOmoTest.svg",
        title: "Omo Test",
        subtitle: "by MamaOmo",
      },
    },
  ];

  const labelDevices = {
    data: {
      label: "Devices with Access to your Odentity",
    },
  };
  const labelDapps = {
    data: {
      label: "Dapps with Access to your Data",
    },
  };
</script>

<Compose rows="1fr" columns="1fr" tw="px-4 lg:p-6">
  <div>
    <CategoryTitle mapping={labelDevices} />
    <div class="space-y-2">
      {#each accessDevices as item}
        <AccessItem mapping={item} />
      {/each}
    </div>
    <CategoryTitle mapping={labelDapps} />
    <div class="space-y-2">
      {#each accessDapps as item}
        <AccessItem mapping={item} />
      {/each}
    </div>
  </div>
</Compose>

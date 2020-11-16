<script lang="ts">
    import {CirclesHub} from "src/libs/o-circles-protocol/circles/circlesHub";
    import {
        AddressLookup,
        Person, TokenAndOwner,
    } from "src/libs/o-circles-protocol/model/person";
    import {config} from "src/libs/o-circles-protocol/config";
    import FriendItem from "src/libs/o-views/molecules/FriendItem.svelte";

    export let address: string;
    let mySafeAddress: string;

    let person: Person;
    let personsThatTrustMe: any[] = [];
    let personsITrust: any[] = [];
    let mutualTrusts: any[] = [];
    let mutual: { [address: string]: any } = {};
    let untrusted: any[] = [];
    let untrusted_: { [address: string]: any } = {};

    function init(addr: string)
    {
        const hubAddress = config.getCurrent().HUB_ADDRESS;
        const circlesHub = new CirclesHub(config.getCurrent().web3(), hubAddress);
        mySafeAddress = localStorage.getItem("omo.safeAddress");

        person = new Person(circlesHub, addr);

        reload();
    }

    async function reload()
    {
        let t1: AddressLookup = await person.getPersonsThatTrustMe();
        let t2: AddressLookup = await person.getPersonsITrust();

        Object.keys(t1)
            .map((k) => <TokenAndOwner>t1[k])
            .filter(o => o.limit > 0)

        untrusted = Object.keys(t2)
            .map((k) => <TokenAndOwner>t2[k])
            .filter(o => o && o.limit == 0)
            .map((mutualTrust) =>
            {
                untrusted_[mutualTrust.owner.address] = true;
                return {
                    image:
                        "https://avatars.dicebear.com/api/avataaars/" +
                        mutualTrust.owner.address +
                        ".svg ",
                    title: mutualTrust.owner.address.slice(0, 8),
                    connection: "trust removed"+ ": " + mutualTrust.limit,
                    detail: {
                        address: mutualTrust.owner.address,
                    },
                    actions: ["trust"],
                };
            });

        let tt2 = {};
        Object.keys(t2).map(o => t2[o]).filter(o => o.limit > 0).forEach(o => {
            tt2[o.owner.address] = o;
        });

        mutualTrusts = Object.keys(t1)
            .map((k) => <TokenAndOwner>t1[k])
            .filter(o => o.limit > 0)
            .filter((o) =>
            {
                const isMutual = tt2[o.owner.address] !== undefined;
                if (isMutual) mutual[o.owner.address] = true;

                return isMutual;
            })
            .map((mutualTrust) =>
            {
                return {
                    image:
                        "https://avatars.dicebear.com/api/avataaars/" +
                        mutualTrust.owner.address +
                        ".svg ",
                    title: mutualTrust.owner.address.slice(0, 8),
                    connection: "mutual trust" + ": " + mutualTrust.limit,
                    detail: {
                        address: mutualTrust.owner.address,
                    },
                    actions: ["untrust", "send"],
                };
            });


        personsThatTrustMe = Object.keys(t1)
            .map((k) => <TokenAndOwner>t1[k])
            .filter(o => o.limit > 0)
            .filter((o) =>  !mutual[o.owner.address] && !untrusted_[o.owner.address])
            .map((personsThatTrustMe) =>
            {
                return {
                    image:
                        "https://avatars.dicebear.com/api/avataaars/" +
                        personsThatTrustMe.owner.address +
                        ".svg ",
                    title: personsThatTrustMe.owner.address.slice(0, 8),
                    connection: "is trusting you" + ": " + personsThatTrustMe.limit,
                    detail: {
                        address: personsThatTrustMe.owner.address,
                    },
                    actions: ["send", "trust"],
                };
            });

        personsITrust = Object.keys(t2)
            .map((k) => <TokenAndOwner>t2[k])
            .filter(o => o.limit > 0)
            .filter((o) => !mutual[o.owner.address])
            .map((personsITrust) =>
            {
                return {
                    image:
                        "https://avatars.dicebear.com/api/avataaars/" +
                        personsITrust.owner.address +
                        ".svg ",
                    title: personsITrust.owner.address.slice(0, 8),
                    connection: "trusted by you" + ": " + personsITrust.limit,
                    detail: {
                        address: personsITrust.owner.address,
                    },
                    actions: ["untrust"],
                };
            });
    }

    $: {
        if (config.getCurrent().web3().utils.isAddress(address))
        {
            init(address);
        }
    }

    let removed = {
        image: "https://avatars.dicebear.com/api/avataaars/removed.svg",
        title: "0x1234",
        connection: "trust removed",
        detail: {
            address: "0x123788dbgx12o81eb8oznogGASfgonolialsf",
        },
        actions: ["trust"],
    };
</script>

<div class="py-2 font-bold text-secondary">New friends trusting me</div>

{#each personsThatTrustMe as personThatTrustMe}
    <FriendItem data={personThatTrustMe}/>
{/each}

<div class="py-2 font-bold text-secondary">Mutual Friends</div>

<div class="space-y-2">
    {#each mutualTrusts as mutualTrust}
        <FriendItem data={mutualTrust}/>
        <!-- <div class="flex w-full bg-white border border-gray-300 rounded">
        <img
          src="https://avatars.dicebear.com/api/avataaars/{mutualTrust.owner.address}.svg"
          alt="profile"
          class="h-12" />
        <div class="flex-1 px-2 py-2 text-base">
          <div class="text-xs text-primary">{mutualTrust.owner.address}</div>
          <p class="text-xs text-gray-500">
            <i class="fas fa-exchange-alt" /><span class="ml-2">mutual trust</span>
          </p>
        </div>
        <div class="flex items-center content-end justify-center" >
          <div on:click={() => runSetTrust(mutualTrust.owner.address)}
            class="flex items-center content-end justify-center w-12 h-12 p-3 border-l border-gray-300 rounded ">
            <img src="icons/removeTrust.svg" alt="add" />
          </div>
          <div on:click={() => runTransferCircles(mutualTrust.owner.address)}
            class="flex items-center content-end justify-center w-12 h-12 p-3 border-l border-gray-300 rounded bg-primary">
            <i class="fas fa-money-bill-wave" />
          </div>
        </div>
      </div> -->
    {/each}


    <div class="py-2 font-bold text-secondary">Pending trust requests</div>

    {#each personsITrust as personITrust}
        <FriendItem data={personITrust}/>
    {/each}

    <div class="py-2 font-bold text-secondary">Friends, who I removed</div>

    {#each untrusted as ut}
        <FriendItem data={ut}/>
    {/each}
</div>

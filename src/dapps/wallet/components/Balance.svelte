<script lang="ts">
    import {CirclesHub} from "../../../libs/o-circles-protocol/circles/circlesHub";
    import {Person} from "../../../libs/o-circles-protocol/model/person";
    import {config} from "../../../libs/o-circles-protocol/config";
    import {BN} from "ethereumjs-util";

    export let address:string;

    let person: Person;
    let balance: BN;
    let balanceString: string;

    function init(address:string)
    {
        const hubAddress = config.getCurrent().HUB_ADDRESS;
        const circlesHub = new CirclesHub(config.getCurrent().web3(), hubAddress);

        person = new Person(circlesHub, address);

        reload();
    }

    async function reload()
    {
        balance = await person.getBalance();
        const balanceStr = config.getCurrent().web3().utils.fromWei(balance, "ether");
        const dot = balanceStr.indexOf(".");
        balanceString = balanceStr.slice(0, dot + 3);
    }

    $:{
        if (config.getCurrent().web3().utils.isAddress(address))
        {
            init(address);
        }
    }
</script>

<div class="grid w-full">
    <div class="flex items-center justify-center mx-4 mt-2 mb-2 text-5xl font-bold text-center text-white border border-gray-200 rounded bg-primary">
        <p class="py-12 text-gray-100 uppercase font-title">{balanceString} ø</p>
    </div>
</div>

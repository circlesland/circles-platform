<script lang="ts">
    import {CirclesHub} from "../../../libs/o-circles-protocol/circles/circlesHub";
    import {Person} from "../../../libs/o-circles-protocol/model/person";
    import {config} from "../../../libs/o-circles-protocol/config";
    import {BN} from "ethereumjs-util";

    let person: Person;
    let balance: BN;
    let balanceString: string;

    function init()
    {
        const hubAddress = config.getCurrent().HUB_ADDRESS;
        const circlesHub = new CirclesHub(config.getCurrent().web3(), hubAddress);
        const safeAddress = localStorage.getItem("omo.safeAddress");

        person = new Person(circlesHub, safeAddress);
    }

    init()
</script>

<div class="grid w-full">
    <div class="flex items-center justify-center mx-4 mt-4 text-2 font-bold text-center text-white border border-gray-200 rounded bg-primary">
        {person.address}
    </div>
</div>

<script lang="ts">

    import {CirclesHub} from "../libs/o-circles-protocol/circles/circlesHub";
    import {GnosisSafeProxy} from "../libs/o-circles-protocol/safe/gnosisSafeProxy";
    import {Person} from "../libs/o-circles-protocol/model/person";
    import {config} from "../libs/o-circles-protocol/config";
    import {BN} from "ethereumjs-util";

    let person: Person;
    let safe: GnosisSafeProxy;
    let balance: BN;
    let balanceString: string;

    function init()
    {
        const hubAddress = "0x29b9a7fBb8995b2423a71cC17cf9810798F6C543";
        const circlesHub = new CirclesHub(config.getCurrent().web3(), hubAddress);
        const safeAddress = localStorage.getItem("omo.safeAddress");
        const ownerAddress = localStorage.getItem("omo.address");

        safe = new GnosisSafeProxy(config.getCurrent().web3(), ownerAddress, safeAddress);
        person = new Person(circlesHub, safeAddress);

        reload();
    }

    async function reload() {
        balance = await person.getBalance();
        const balanceStr = config.getCurrent().web3().utils.fromWei(balance, "ether");
        const dot = balanceStr.indexOf(".");
        balanceString = balanceStr.slice(0, dot + 3);
    }
</script>

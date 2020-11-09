<script lang="ts">
    import {CirclesHub} from "../../../libs/o-circles-protocol/circles/circlesHub";
    import {Person} from "../../../libs/o-circles-protocol/model/person";
    import {config} from "../../../libs/o-circles-protocol/config";
    import {BN} from "ethereumjs-util";

    export let address:string;

    let person: Person;
    let balance: BN;
    let safeEthBalance: BN;
    let personalEthBalance: BN;

    let circlesBalance: string;
    let safeEtherBalance: string;
    let personalEtherBalance: string;

    function init(address:string)
    {
        const hubAddress = config.getCurrent().HUB_ADDRESS;
        const circlesHub = new CirclesHub(config.getCurrent().web3(), hubAddress);

        person = new Person(circlesHub, address);

        reload();
    }

    async function reload()
    {
        balance = await person.getTokenBalance();
        const balanceStr = config.getCurrent().web3().utils.fromWei(balance, "ether");
        const dot = balanceStr.indexOf(".");
        circlesBalance = balanceStr.slice(0, dot + 3);

        safeEthBalance = await person.getEthBalance();
        const ethBalanceStr = config.getCurrent().web3().utils.fromWei(safeEthBalance, "ether");
        const ethDot = ethBalanceStr.indexOf(".");
        safeEtherBalance = ethBalanceStr.slice(0, ethDot + 7);

        personalEtherBalance = await person.circlesHub.web3.eth.getBalance(localStorage.getItem("omo.address"));
        const personalEthBalanceStr = config.getCurrent().web3().utils.fromWei(personalEtherBalance, "ether");
        const personalEthDot = personalEthBalanceStr.indexOf(".");
        personalEtherBalance = personalEthBalanceStr.slice(0, personalEthDot + 7);
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
            <p style="line-height: 1em;" class="py-12 text-gray-100 uppercase font-title">{circlesBalance} ø<br/>
                <span class="-mt-1 text-sm">Safe: {safeEtherBalance} xDai</span><br/>
                <span class="-mt-1 text-sm">Owner: {personalEtherBalance} xDai</span><br/>
            </p>
    </div>
</div>

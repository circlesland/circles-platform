<script lang="ts">
    import {config} from "src/libs/o-circles-protocol/config";
    import {createEventDispatcher} from "svelte";
    import {ByteString} from "../../o-circles-protocol/interfaces/byteString";
    import {mnemonicToEntropy} from "bip39"

    const dispatch = createEventDispatcher();

    let isValid = true;
    export let privateKeyPhrase: string;
    let privateKeyByteString: ByteString;

    $: {
        try {
            privateKeyByteString = mnemonicToEntropy(privateKeyPhrase);
            const account = config.getCurrent().web3().eth.accounts.privateKeyToAccount(privateKeyByteString);
            isValid = config.getCurrent().web3().utils.isAddress(account.address);
            if (isValid)
            {
                dispatch("value", {
                    type: "bytestring",
                    data: privateKeyByteString,
                });
            }
        }catch {
            isValid = false;
        }
    }
</script>

<div>
    <input
            class:border={!isValid}
            class:border-red-500={!isValid}
            placeholder="0x1234..."
            type="text"
            bind:value={privateKeyPhrase}/>
</div>

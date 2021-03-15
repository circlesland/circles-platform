#omo-circles
A [web3](https://web3js.readthedocs.io/en/v1.3.0/) based client library for the [circles](https://github.com/CirclesUBI/whitepaper/) protocol.

The lib wraps all three parts that are essential to the circles system:
* Gnosis Safe
* Circles Hub
* ERC20 Token


## Code examples (queries)
### CirclesAccount
#### Find the Circles token of a specific safe address
```typescript
import {CirclesAccount} from "omo-circles/dist/model/circlesAccount";

async function getCirclesTokenOfSafeAddress() {
    const safeAddress = "0x";
    const foundTokenOrNull = await new CirclesAccount(safeAddress).tryGetMyToken();
    if (!foundTokenOrNull) {
        console.log("The safe isn't yet signed-up at the circles hub")
    }
}
```
#### Get all contacts (incoming or outgoing trusts) of a safe
```typescript
import {CirclesAccount} from "omo-circles/dist/model/circlesAccount";

function getContacts() {
    const safeAddress = "0x";
    
    // This will give you all historic and live trust-events for the safe:
    const contactsObservable = new CirclesAccount(safeAddress).subscribeToMyContacts();
    contactsObservable.subscribe(event => {        
        const {user, canSendTo, limit} = event.returnValues;
        
        if (user == safeAddress)
        {
            console.log(`${canSendTo} trusts me (${limit})%`) 
        } 
        else 
        {
            console.log(`I trust ${user} (${limit})%`)
        }
    });
}
```
### CirclesToken
#### Get all past circles-transactions from or to a safe (not only HubTransfers)
This example is a little more complicated because it spans multiple necessary steps:
1. Find all contacts of the safe
2. Find all tokens of these contacts
3. Query all transactions of all found tokens that have our safe as source or target

```typescript
import {CirclesAccount} from "omo-circles/dist/model/circlesAccount";
import {OmoSubject} from "omo-quirks/dist/OmoSubject";

async function getTransactioHistoryOfSafe() {
    // TODO
}
```

## Code examples (mutations)
### GnosisSafeProxyFactory
#### Deploy a new safe proxy
```typescript
import {GnosisSafeProxyFactory} from "omo-circles/dist/safe/gnosisSafeProxyFactory";
import {config} from "omo-circles/dist/config";

async function deployNewSafe() {
    const web3 = config.getCurrent().web3();
    const safeProxyFactory = new GnosisSafeProxyFactory(
        web3,
        config.getCurrent().PROXY_FACTORY_ADDRESS,
        config.getCurrent().GNOSIS_SAFE_ADDRESS);

    /**
     JUST FOR ILLUSTRATION.
     The call to "deployNewSafeProxy" will always fail because a new account
     will have no funds to pay for the gas.
     **/
    const newEthAccount = web3.eth.accounts.create();
    const safeProxy = await safeProxyFactory.deployNewSafeProxy(newEthAccount.privateKey);
    return safeProxy;
}
```

### GnosisSafeProxy
#### Execute an arbitrary ABI-encoded transaction via safe
```typescript
import {GnosisSafeProxy} from "omo-circles/dist/safe/gnosisSafeProxy";
import {config} from "omo-circles/dist/config";
import BN from "omo-quirks/dist/BN";

async function executeArbitrarySafeTransaction() {
    // The account that owns the safe proxy
    const safeOwnerAddress = "0x";
    const safeOwnerPrivateKey = "0x";
    // The contract address of the safe proxy
    const safeAddress = "0x";

    // The abi encoded transaction that should be executed by the safe
    const txData = "0x";
    // The safe should send the above transaction to this recipient address:
    const txRecipient = "0x";

    // Create the safe proxy with the above information
    const web3 = config.getCurrent().web3();
    const safeProxy = new GnosisSafeProxy(web3, safeOwnerAddress, safeAddress);

    // Execute the transaction
    const receipt = await safeProxy.execTransaction(
        safeOwnerPrivateKey,
        {
            to: txRecipient,
            data: txData,
            value: new BN("0"),             // Don't send xDai
            refundReceiver: ZERO_ADDRESS,   // Refunds should be returned to sender
            gasToken: ZERO_ADDRESS,         // Use default (xDai) as gas token
            operation: SafeOps.CALL
        });

    console.log(receipt);
}
```

### CirclesHub
#### Signup at the circles hub
```typescript
import {GnosisSafeProxy} from "omo-circles/dist/safe/gnosisSafeProxy";
import {CirclesHub} from "omo-circles/dist/circles/circlesHub";
import {config} from "omo-circles/dist/config";

async function signupAtCircles() {
    // The account that owns the safe proxy
    const safeOwnerAddress = "0x";
    const safeOwnerPrivateKey = "0x";
    // The contract address of the safe proxy
    const safeAddress = "0x";
    
    const web3 = config.getCurrent().web3();
    const safeProxy = new GnosisSafeProxy(web3, safeOwnerAddress, safeAddress);
    const circlesHub = new CirclesHub(web3, config.getCurrent().HUB_ADDRESS);
    
    await circlesHub.upsertProfile(
        safeOwnerPrivateKey,
        safeProxy
    );
}
```
#### Trust/Untrust someone
```typescript
import {GnosisSafeProxy} from "omo-circles/dist/safe/gnosisSafeProxy";
import {CirclesHub} from "omo-circles/dist/circles/circlesHub";
import {config} from "omo-circles/dist/config";

function trustSomeone() {
    // The account that owns the safe proxy
    const safeOwnerAddress = "0x";
    const safeOwnerPrivateKey = "0x";
    // The contract address of the safe proxy
    const safeAddress = "0x";
    
    // The address of the safe that receives the trust
    const trustReceivingSafeAddress = "0x";

    const web3 = config.getCurrent().web3();
    const safeProxy = new GnosisSafeProxy(web3, safeOwnerAddress, safeAddress);
    const circlesHub = new CirclesHub(web3, config.getCurrent().HUB_ADDRESS);

    // Create a trust relation from 'safeAddress' to 'trustReceivingSafeAddress' with 100% trust.
    // How much you trust someone will affect the liquidity of that person in transitive payments.
    circlesHub.setTrust(
        safeOwnerPrivateKey,
        safeProxy,
        trustReceivingSafeAddress,
        new BN(100) // use 'new BN("0")' to untrust 
    );
}
```
#### Send circles via Hub
```typescript
import {GnosisSafeProxy} from "omo-circles/dist/safe/gnosisSafeProxy";
import {CirclesHub} from "omo-circles/dist/circles/circlesHub";
import {config} from "omo-circles/dist/config";

async function sendCircles() {
    // The account that owns the safe proxy
    const safeOwnerAddress = "0x";
    const safeOwnerPrivateKey = "0x";
    // The contract address of the safe proxy
    const safeAddress = "0x";

    // The address of the safe that receives the circles
    const transactionRecipient = "0x";
    // The amount of circles that should be transferred
    const circlesValueInWei = new BN("1234")    

    const web3 = config.getCurrent().web3();
    const safeProxy = new GnosisSafeProxy(web3, safeOwnerAddress, safeAddress);
    const circlesHub = new CirclesHub(web3, config.getCurrent().HUB_ADDRESS);

    //
    // Circles supports (or even requires) multi-step transactions via transitive paths.
    // The following fields express the payment path.
    // This example is limited to a direct transfer between two users.
    // To perform a transitive payment, you'll additionally need
    // a router like https://github.com/chriseth/pathfinder
    //
    const tokenOwners = [safeAddress];
    const sources = [safeAddress];
    const destinations = [transactionRecipient];
    const values = [circlesValueInWei];

    const receipt = await circlesHub.transferTrough(
        safeOwnerPrivateKey,
        safeProxy,
        tokenOwners,
        sources,
        destinations,
        values
    );
}
```
### CirclesAccount
#### Request UBI
```typescript
import {GnosisSafeProxy} from "omo-circles/dist/safe/gnosisSafeProxy";
import {CirclesAccount} from "omo-circles/dist/model/circlesAccount";
import {config} from "omo-circles/dist/config";

async function requestUbi() {
    // The account that owns the safe proxy
    const safeOwnerAddress = "0x";
    const safeOwnerPrivateKey = "0x";
    // The contract address of the safe proxy
    const safeAddress = "0x";
    
    const web3 = config.getCurrent().web3();
    const safeProxy = new GnosisSafeProxy(web3, safeOwnerAddress, safeAddress);

    const circlesAccount = new CirclesAccount(safeAddress);
    const receipt = await circlesAccount.getUBI(safeOwnerPrivateKey, safeProxy);
}
```
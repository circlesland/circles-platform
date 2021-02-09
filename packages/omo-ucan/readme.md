# UCANs for NodeJS
Provides dependency-free functions to create and validate UCANs in NodeJS.  

*Warning: This is still work in progress (It doesn't yet validate the 'fct', 'rsc', 'prf' and 'ptc' claims and it's RSA only).*
### Create a UCAN
```typescript
const {generateKeyPairSync} = require('crypto');
const {stripPem, publicKeyToDid, buildUcan} = require("omo-ucan/dist/index");

// Create a KeyPair
const keyPair = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    }
});

// didHelper.publicKeyToDid() needs the raw base64 string without PEM envelope
const pub = stripPem(keyPair.publicKey);

// Create a did from the public key
const iss = publicKeyToDid(pub);
const aud = "AUDIENCE DID GOES HERE";

// Create the UCAN with a PEM formatted signing key
const ucan = await buildUcan(keyPair.privateKey, {
    issuer: iss,
    potency: "APPEND",
    audience: aud,
    facts: undefined,
    lifetimeInSeconds: 3600,
    resource: "*"
});

console.log(ucan);
```

### Validate a UCAN
```typescript
const {verifyUcan} = require("omo-ucan/dist/index");

// This is your DID. The validated UCAN must contain it as 'aud' claim 
const aud = "AUDIENCE DID GOES HERE";
const validationErrors = await verifyUcan(ucan, aud);

if (validationErrors.length === 0)
    console.log("The UCAN is valid")
else
    validationErrors.forEach(o => console.log("Verification problem: ", o));
```

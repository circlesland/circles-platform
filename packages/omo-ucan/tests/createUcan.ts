const didToPublicKey = require("../dist/didToPublicKey");
const consts = require("../dist/consts");
const buildUcan = require("../dist/buildUcan");
const verifyUcan = require("../dist/verifyUcan");
const {subtle} = require('crypto').webcrypto;
const myDid = "did:key:zStEZpzSMtTt9k2vszgvCwF4fLQQSyA15W5AQ4z3AR6Bx4eFJ5crJFbuGxKmbma4";

describe('buildUcan', function()
{
    it('should build a valid ucan for a random new identity.', async () =>
    {
        const key = await subtle.generateKey({
            name: consts.RSA_WRITE_ALG,
            modulusLength: 2048,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: consts.DEFAULT_HASH_ALG
        }, true, ["sign", "verify"]);

        const exportedKey = await subtle.exportKey("spki", key.publicKey);
        const iss = didToPublicKey.publicKeyToDid(Buffer.from(exportedKey).toString("base64"), consts.CryptoSystem.RSA);

        const ucan = await buildUcan.buildUcan(key, {
            issuer: iss,
            potency: "APPEND",
            audience: myDid,
            facts: undefined,
            lifetimeInSeconds: 1000,
            resource: "*"
        });

        const verificationResult = await verifyUcan.verifyUcan(ucan, myDid);
        verificationResult.forEach(o => console.log("Verify result:", o));

        expect(verificationResult.length === 0);
    })
});

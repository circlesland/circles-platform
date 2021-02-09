const {generateKeyPairSync} = require('crypto');
const {stripPem, verifyUcan, publicKeyToDid, buildUcan} = require("../dist/index");

const myDid = "did:123";

describe('buildUcan', function()
{
    it('should build a valid ucan for a random new identity.', async () =>
    {
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

        const pub = stripPem(keyPair.publicKey);
        const iss = publicKeyToDid(pub);

        const ucan = await buildUcan(keyPair.privateKey, {
            issuer: iss,
            potency: "APPEND",
            audience: myDid,
            facts: undefined,
            lifetimeInSeconds: 1000,
            resource: "*"
        });

        const verificationResult = await verifyUcan(ucan, myDid);
        verificationResult.forEach((message:string) => console.log("Verification problem: ", message));

        if (verificationResult.length > 0)
            throw new Error("Validation failed");
    })
});

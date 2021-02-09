const {stripPem} = require("../dist/verifyUcan");
const didHelper = require("../dist/didHelper");
const buildUcan = require("../dist/buildUcan");
const verifyUcan = require("../dist/verifyUcan");
const crypto = require('crypto');
const myDid = "";

describe('buildUcan', function()
{
    it('should build a valid ucan for a random new identity.', async () =>
    {
        const keyPair = crypto.generateKeyPairSync('rsa', {
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

        const iss = didHelper.publicKeyToDid(pub);
        const ucan = await buildUcan.buildUcan(keyPair.privateKey, {
            issuer: iss,
            potency: "APPEND",
            audience: myDid,
            facts: undefined,
            lifetimeInSeconds: 1000,
            resource: "*"
        });

        const verificationResult = await verifyUcan.verifyUcan(ucan, myDid);
        verificationResult.forEach(o => console.log("Verification problem: ", o));

        expect(verificationResult.length === 0);
    })
});

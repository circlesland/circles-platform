const {generateKeyPairSync} = require('crypto');
const {stripPem, verifyUcan, publicKeyToDid, buildUcan} = require("../dist/index");

const omoCentralDid = "did:key:z13V3Sog2YaUKhdGCmgx9UZuW1o1ShFJYc6DvGYe7NTt689NoL3BXcUQBZ85Rhs2NFwee4cjCvPSuf3aHu7DHzg5MCZnFwZ5ae2aeCEyatEK8bZwdMHfTgHqeoAjCkYYsq6QGtDfjNDxoqRwv4zFqvQDf7qWmJpxWVae75fmZY6kSSnGzsTmmzPBAbF6zqT5p6Xr4GXypQUBmHrwW7M5wpBFs8RsUQdF7n3JbCAwzBWsQGgrvdyFm6hQCN7qyBpgsh3jjnVi32uQkUu98ZCPTT5DWni2mynFNFMXKP3Rqv8a1doM19JPNu6HyxwupGZ7tyqrRZvQvRQStEMPsDBvsbxmJhwEmq69it7V6Y4fi8VwBrrK4gfBW2AMJpa1qfHHUP9ZBWVYYGwuSMPJ4c19Xe8";

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

        console.log(`Test DID is:`, iss);

        const ucan = await buildUcan(keyPair.privateKey, {
            issuer: iss,
            potency: "APPEND",
            audience: omoCentralDid,
            facts: undefined,
            lifetimeInSeconds: 3600 * 24 * 365,
            resource: "*"
        });

        console.log(`Test UCAN is:`, ucan);

        const verificationResult = await verifyUcan(ucan, omoCentralDid);
        verificationResult.forEach((message:string) => console.log("Verification problem: ", message));

        if (verificationResult.length > 0)
            throw new Error("Validation failed");
    })
});

const didHelper = require("../dist/didHelper");

const dids = [
    ""
];

describe('didToPublicKey', function()
{
    it('should parse a base58 encoded DID and return a CryptoKey object containing the public key', async () =>
    {
        for (let did of dids)
        {
            const publicKey = await didToPublicKey.didToPublicKey(did);

            expect(publicKey);
            expect(publicKey.type === "public");
        }
    });
});

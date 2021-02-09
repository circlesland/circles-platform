const verifyUcan = require("../dist/verifyUcan");
const jwts = [""];
const myDid = "";

describe('verifyUcan', function()
{
    it('should verify the given ucan and return "true" for a valid ucan and "false" for invalid ucans.', async () =>
    {
        for (let jwt of jwts)
        {
            const errors = await verifyUcan.verifyUcan(jwt, myDid);
            errors.forEach(error => console.log(error));
            expect(errors.length === 0);
        }
    });
});

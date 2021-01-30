export class Generate
{
    static randomHexString(length:number=16) : string
    {
        const randomData = new Uint8Array(length);
        window.crypto.getRandomValues(randomData);
        const randomDataBuffer = Buffer.from(randomData);
        return randomDataBuffer.toString("hex");
    }
}

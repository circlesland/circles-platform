import * as IPFS from "ipfs";

export class IpfsNode
{
    static async runWithIPFS<TResult>(action:(ipfs:IPFS.IPFS) => Promise<TResult>) : Promise<TResult>
    {
        if (IpfsNode._creating)
        {
            return new Promise((resolve, reject) =>
            {
                IpfsNode._waitingList.push({
                    action: action,
                    resolve: resolve,
                    reject: reject
                });
            });
        }

        if (!IpfsNode._instance)
        {
            IpfsNode._creating = true;
            IpfsNode._instance = await IPFS.create();
            IpfsNode._creating = false;
        }

        IpfsNode._waitingList.forEach(entry =>
        {
            try
            {
                const result = entry.action(IpfsNode._instance);
                entry.resolve(result);
            }
            catch (e)
            {
                entry.reject(e);
            }
        });

        return await action(IpfsNode._instance);
    }
    private static _creating:boolean;
    private static _waitingList:{
        action:(ipfs:IPFS.IPFS) => Promise<any>,
        resolve: (result:any) => void,
        reject: (error:any) => void
    }[] = [];
    private static _instance:IPFS.IPFS;
}

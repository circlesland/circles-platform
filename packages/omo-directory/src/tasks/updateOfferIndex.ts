import {OfferIndex} from "omo-indexes/dist/offerIndex";
import {IpfsNode} from "omo-indexes/dist/ipfsNode";
import {InMemoryOfferIndex} from "../main";
const fs = require('fs');

export async function updateOfferIndex(fissionName:string, offerIndex:InMemoryOfferIndex) : Promise<string>
{
    return IpfsNode.runWithIPFS(async ipfs =>
    {
        return new Promise<any>((async (resolve, reject) =>
        {
            let done = false;
            setTimeout(() =>
            {
                if (done)
                {
                    return;
                }
                reject(new Error(`The execution of Task '${fissionName}' timed out after 60 sec.`));
            }, 60000);

            const offerMetadata = await OfferIndex.tryReadPublicOffers(fissionName)
            if (offerMetadata && offerMetadata.length > 0)
            {
                offerIndex[fissionName] = offerMetadata;
            }
            else
            {
                delete offerIndex[fissionName];
            }

            const cid = await ipfs.add(<any>JSON.stringify(offerIndex));
            await ipfs.pin.add(cid.cid);

            done = true;
            resolve(cid.cid);
        }));
    });
}

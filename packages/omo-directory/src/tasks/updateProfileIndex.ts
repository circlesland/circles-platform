import {IpfsNode} from "omo-indexes/dist/ipfsNode";
import {ProfileIndex} from "omo-indexes/dist/profileIndex";
import {InMemoryProfileIndex} from "../main";

export async function updateProfileIndex(fissionName:string, profileIndex:InMemoryProfileIndex) : Promise<string>
{
    return IpfsNode.runWithIPFS(async ipfs =>
    {
        return new Promise<any>((async (resolve, reject) =>
        {
            try
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

                console.log("loading profile of '" + fissionName + "' ..");
                const otherProfileObj = await ProfileIndex.tryReadPublicProfile(fissionName)

                const existingDirectoryEntry = profileIndex[fissionName];
                if (existingDirectoryEntry)
                {
                    const changed =
                        existingDirectoryEntry.firstName != otherProfileObj?.profile.firstName
                        || existingDirectoryEntry.lastName != otherProfileObj?.profile.lastName
                        || existingDirectoryEntry.circlesSafe != otherProfileObj?.profile.circlesAddress;

                    if (changed)
                    {
                        console.log(`Entry '${fissionName}' was updated.`)
                    }
                }
                else
                {
                    console.log(`Entry '${fissionName}' was added.`)
                }

                profileIndex[fissionName] = {
                    fsRootCid: otherProfileObj?.fsRootCid ?? "",
                    avatarCid: otherProfileObj?.avatarCid ?? "",
                    firstName: otherProfileObj?.profile.firstName ?? "",
                    lastName: otherProfileObj?.profile.lastName ?? "",
                    circlesSafe: otherProfileObj?.profile.circlesAddress ?? "",
                    fissionName: fissionName
                };

                const cid = await ipfs.add(<any>JSON.stringify(profileIndex));
                await ipfs.pin.add(cid.cid);

                done = true;
                resolve(cid.cid);
            }
            catch (e)
            {
                console.warn("Couldn't load a foreign profile:");
                console.warn(e);
                reject(e);
            }
        }));
    });
}

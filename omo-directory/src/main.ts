import {Request, Response} from "express";
import {Directory, Offers} from "./directory";
import {TaskScheduler} from "./taskScheduler";
import {IpfsNode} from "./indexes/ipfsNode";
import {ProfileIndex} from "./indexes/profileIndex";
import {OfferIndex} from "./indexes/offerIndex";

const fs = require('fs');
const express = require("express");
const router = express.Router();
const app = express();
const profileUpdateScheduler = new TaskScheduler();

let directory:Directory = {};
let offers:Offers = {};
let lastDirectoryCid: any = "You're alone";
let lastOffersCid: any = "You're alone";

export const catRaw = async (cid: any): Promise<Buffer[]> => {
    return IpfsNode.runWithIPFS(async ipfs =>
    {
        const chunks = []
        for await (const chunk of ipfs.cat(cid))
        {
            chunks.push(Buffer.from(chunk))
        }
        return chunks
    });
}

export const catBuf = async (cid: any): Promise<Buffer> => {
    const raw = await catRaw(cid)
    return Buffer.concat(raw)
}

async function init()
{
    console.log("Creating IPFS node ..")
    return IpfsNode.runWithIPFS(async _ =>
    {
        console.log("Loading the directory cid from 'lastDirectoryCid.cid'");
        await fs.exists("lastDirectoryCid.cid", async (exists: boolean) =>
        {
            if (exists)
            {
                fs.readFile('lastDirectoryCid.cid', async (error: any, data: any) =>
                {
                    console.log("Loading the directory from ", data.toString());

                    lastDirectoryCid = data.toString();
                    const buf = await catBuf(data.toString());
                    directory = JSON.parse(buf.toString());
                });
            }
            else
            {
                console.log("No directory cid at 'lastDirectoryCid.cid'");
            }
        });
        await fs.exists("lastOffersCid.cid", async (exists: boolean) =>
        {
            if (exists)
            {
                fs.readFile('lastOffersCid.cid', async (error: any, data: any) =>
                {
                    console.log("Loading the directory from ", data.toString());

                    lastOffersCid = data.toString();
                    const buf = await catBuf(data.toString());
                    offers = JSON.parse(buf.toString());
                });
            }
            else
            {
                console.log("No directory cid at 'lastOffersCid.cid'");
            }
        });
    });
}

router.get('/profiles', (request:Request,response:Response) =>
{
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");
    response.send(lastDirectoryCid.toString());
});

router.get('/offers', (request:Request,response:Response) =>
{
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");
    response.send(lastOffersCid.toString());
});

router.get('/list',(request:Request,response:Response) =>
{
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");
    response.send(JSON.stringify(directory, null, 2));
});

router.post('/update/offers/:fissionName', async (request:Request,response:Response) =>
{
    // TODO: The profile is only available after the IPNS link was updated.
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");

    const taskName = "updateOffers_" + request.params.fissionName;
    profileUpdateScheduler.addOrResetTask(taskName, 5, async () =>
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
                    reject(new Error(`The execution of Task '${taskName}' timed out after 60 sec.`));
                }, 60000);

                const offerMetadata = await OfferIndex.tryReadPublicOffers(request.params.fissionName)
                if (offerMetadata && offerMetadata.length > 0)
                {
                    offers[request.params.fissionName] = offerMetadata;
                }
                else
                {
                    delete offers[request.params.fissionName];
                }

                const cid = await ipfs.add(<any>JSON.stringify(offers));
                await ipfs.pin.add(cid.cid);

                await fs.writeFile('lastOffersCid.cid', cid.cid.toString(), () =>
                {
                    console.log("Wrote last cid:", cid.cid.toString());
                });

                done = true;
                lastDirectoryCid = cid.cid;
                resolve();
            }));
        });
    });

    response.send("Pending");
});

router.post('/signup/:fissionName', async (request:Request,response:Response) =>
{
    // TODO: The profile is only available after the IPNS link was updated.
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");

    const taskName = "updateProfile_" + request.params.fissionName;
    profileUpdateScheduler.addOrResetTask(taskName, 5, async () =>
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
                        reject(new Error(`The execution of Task '${taskName}' timed out after 60 sec.`));
                    }, 60000);

                    console.log("loading profile of '" + request.params.fissionName + "' ..");
                    const otherProfileObj = await ProfileIndex.tryReadPublicProfile(request.params.fissionName)

                    const existingDirectoryEntry = directory[request.params.fissionName];
                    if (existingDirectoryEntry)
                    {
                        const changed =
                            existingDirectoryEntry.firstName != otherProfileObj?.profile.firstName
                            || existingDirectoryEntry.lastName != otherProfileObj?.profile.lastName
                            || existingDirectoryEntry.circlesSafe != otherProfileObj?.profile.circlesAddress;

                        if (changed)
                        {
                            console.log(`Entry '${request.params.fissionName}' was updated.`)
                        }
                    }
                    else
                    {
                        console.log(`Entry '${request.params.fissionName}' was added.`)
                    }

                    directory[request.params.fissionName] = {
                        avatarCid: otherProfileObj?.avatarCid ?? "",
                        firstName: otherProfileObj?.profile.firstName ?? "",
                        lastName: otherProfileObj?.profile.lastName ?? "",
                        circlesSafe: otherProfileObj?.profile.circlesAddress ?? "",
                        fissionName: request.params.fissionName
                    };

                    const cid = await ipfs.add(<any>JSON.stringify(directory));
                    await ipfs.pin.add(cid.cid);

                    await fs.writeFile('lastDirectoryCid.cid', cid.cid.toString(), () =>
                    {
                        console.log("Wrote last cid:", cid.cid.toString());
                    });

                    done = true;
                    lastDirectoryCid = cid.cid;
                    resolve();
                }
                catch (e)
                {
                    console.warn("Couldn't load a foreign profile:");
                    console.warn(e);
                    reject(e);
                }
            }));
        });
    });

    response.send("Pending");
});


profileUpdateScheduler.start();
// add router in the Express app.
app.use("/", router);
app.listen(5009, async () => {
    await init()
});


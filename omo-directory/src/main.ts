import {Request, Response} from "express";
import * as IPFS from "ipfs-core";
import {Directory, Offers} from "./directory";
import fetch from 'cross-fetch';
import {TaskScheduler} from "./taskScheduler";

const toBuffer = require('it-to-buffer')
const fs = require('fs');
const express = require("express");
const router = express.Router();
const app = express();
const profileUpdateScheduler = new TaskScheduler();

let directory:Directory = {};
let offers:Offers = {};
let lastDirectoryCid: any = "You're alone";
let lastOffersCid: any = "You're alone";
let ipfs:any;

export const catRaw = async (cid: any): Promise<Buffer[]> => {
    const chunks = []
    for await (const chunk of ipfs.cat(cid)) {
        chunks.push(chunk)
    }
    return chunks
}

export const catBuf = async (cid: any): Promise<Buffer> => {
    const raw = await catRaw(cid)
    return Buffer.concat(raw)
}

async function init()
{
    console.log("Creating IPFS node ..")
    ipfs = await IPFS.create();

    console.log("Loading the directory cid from 'lastDirectoryCid.cid'");
    await fs.exists("lastDirectoryCid.cid", async (exists:boolean) => {
        if (exists)
        {
            fs.readFile('lastDirectoryCid.cid', async (error:any, data:any) => {
                console.log("Loading the directory from ", data.toString());

                lastDirectoryCid = data.toString();
                const buf = await catBuf(data.toString());
                directory = JSON.parse(buf.toString());
            });
        } else {
            console.log("No directory cid at 'lastDirectoryCid.cid'");
        }
    });
    await fs.exists("lastOffersCid.cid", async (exists:boolean) => {
        if (exists)
        {
            fs.readFile('lastOffersCid.cid', async (error:any, data:any) => {
                console.log("Loading the directory from ", data.toString());

                lastOffersCid = data.toString();
                const buf = await catBuf(data.toString());
                offers = JSON.parse(buf.toString());
            });
        } else {
            console.log("No directory cid at 'lastOffersCid.cid'");
        }
    });
}

router.get('/directory', (request:Request,response:Response) =>
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

async function resolveFissionName(fissionName:string) : Promise<string|null>
{
    const dnsLink = `https://ipfs.io/api/v0/dns?arg=${fissionName}.fission.name`;
    console.log("loading", dnsLink);
    const dnsLinkResult = await fetch(dnsLink);
    const dnsLinkResultObj = await dnsLinkResult.json();

    if (!dnsLinkResultObj || !dnsLinkResultObj.Path)
    {
        return null;
    }

    return dnsLinkResultObj.Path;
}

router.post('/update/offers/:fissionName', async (request:Request,response:Response) =>
{
    // TODO: The profile is only available after the IPNS link was updated.
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");

    const taskName = "updateOffers_" + request.params.fissionName;
    profileUpdateScheduler.addOrResetTask(taskName, 5, async () =>
    {
        return new Promise<any>((async (resolve, reject) =>
        {
            /*
            try
            {*/
                let done = false;
                setTimeout(() =>
                {
                    if (done)
                    {
                        return;
                    }
                    reject(new Error(`The execution of Task '${taskName}' timed out after 60 sec.`));
                }, 60000);

                const fsRoot = await resolveFissionName(request.params.fissionName);
                const offersRoot = fsRoot + "/userland/Apps/userland/MamaOmo/userland/OmoSapien/userland/offers/userland";

                console.log("Loading " + offersRoot)

                const offerNames:string[] = [];

                const directoryContents = ipfs.files.ls(offersRoot);
                for await (let item of directoryContents)
                {
                    console.log("offer:", item);
                    offerNames.push(item.name);
                }

                const offersJson = await Promise.all(offerNames.map(async offer =>
                {
                    const blocks = await ipfs.files.read(offersRoot + "/" + offer + "/userland");
                    if (!blocks)
                    {
                        throw new Error("Cannot read '" + offersRoot + "/" + offer + "/userland" + "'");
                    }

                    const chunks = [];
                    for await (let chunk of blocks)
                    {
                        chunks.push(chunk)
                    }
                    return Buffer.concat(chunks)
                }));

                const offerObjs = offersJson.map(o => JSON.parse(o)).map(o => {
                    delete o.productPicture;
                    return o;
                });
                offers[request.params.fissionName] = offerObjs;

                const cid = await ipfs.add(JSON.stringify(offers));
                await ipfs.pin.add(cid.cid);

                await fs.writeFile('lastOffersCid.cid', cid.cid.toString(), () => {
                    console.log("Wrote last cid:", cid.cid.toString());
                });

                done = true;
                lastDirectoryCid = cid.cid;
                resolve();
            /*}
            catch (e)
            {
                console.warn("Couldn't load the offers of profile:" + request.params.fissionName);
                console.warn(e);
                reject(e);
            }*/
        }));
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
        return new Promise<any>((async (resolve, reject) =>
        {
            try
            {
                let done = false;
                setTimeout(() => {
                    if (done)
                    {
                        return;
                    }
                    reject(new Error(`The execution of Task '${taskName}' timed out after 60 sec.`));
                }, 60000);

                const fsRoot = await resolveFissionName(request.params.fissionName);
                const otherProfilePath = `https://ipfs.io${fsRoot}/userland/Apps/userland/MamaOmo/userland/OmoSapien/userland/profiles/userland/me/userland`;

                console.log("loading", otherProfilePath);

                const otherProfileData = await fetch(otherProfilePath);
                const otherProfileObj = await otherProfileData.json();

                /*
                const avatar = otherProfileObj.avatar && otherProfileObj.avatar.length > 512
                    ? null
                    : otherProfileObj.avatar
                */
                const existingDirectoryEntry = directory[request.params.fissionName];
                if (existingDirectoryEntry)
                {
                    const changed =
                        existingDirectoryEntry.firstName != otherProfileObj.firstName
                        ||existingDirectoryEntry.lastName != otherProfileObj.lastName
                        ||existingDirectoryEntry.circlesSafe != otherProfileObj.circlesAddress;

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
                    firstName: otherProfileObj.firstName,
                    lastName: otherProfileObj.lastName,
                    //    avatarUrl: avatar,
                    circlesSafe: otherProfileObj.circlesAddress,
                    fissionName: request.params.fissionName
                };

                const cid = await ipfs.add(JSON.stringify(directory));
                await ipfs.pin.add(cid.cid);

                await fs.writeFile('lastDirectoryCid.cid', cid.cid.toString(), () => {
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

    response.send("Pending");
});


profileUpdateScheduler.start();
// add router in the Express app.
app.use("/", router);
app.listen(5009, async () => {
    await init()
});


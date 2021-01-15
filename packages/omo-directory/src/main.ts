import {Request, Response} from "express";
import {TaskScheduler} from "./scheduler/taskScheduler";
import {ProfileIndexEntry} from "omo-indexes/dist/profileIndex";
import {OfferMetadata} from "omo-indexes/dist/offers";
import {updateOfferIndex} from "./tasks/updateOfferIndex";
import {updateProfileIndex} from "./tasks/updateProfileIndex";

const fs = require('fs');
const express = require("express");
const router = express.Router();
const app = express();
const taskScheduler = new TaskScheduler();

export interface InMemoryProfileIndex
{
    [fissionName: string]: ProfileIndexEntry;
}

export interface InMemoryOfferIndex
{
    [fissionName: string]: OfferMetadata[];
}

let inMemoryProfileIndex:InMemoryProfileIndex = {};
let lastProfileIndexCID: any = "You're alone";

let inMemoryOfferIndex:InMemoryOfferIndex = {};
let lastOfferIndexCID: any = "You're alone";

async function init()
{
    console.log("Loading the last known index CIDs ..");

    await fs.exists("lastDirectoryCid.cid", async (exists: boolean) =>
    {
        if (exists)
        {
            fs.readFile('lastDirectoryCid.cid', async (error: any, data: any) =>
            {
                console.log("Loaded the CID of the last profile index: ", data.toString());
                lastProfileIndexCID = data.toString();
            });
        }
        else
        {
            console.log("No profile index cid at 'lastDirectoryCid.cid'");
        }
    });

    await fs.exists("lastOffersCid.cid", async (exists: boolean) =>
    {
        if (exists)
        {
            fs.readFile('lastOffersCid.cid', async (error: any, data: any) =>
            {
                console.log("Loaded the CID of the last offer index: ", data.toString());
                lastOfferIndexCID = data.toString();
            });
        }
        else
        {
            console.log("No offer index cid at 'lastOffersCid.cid'");
        }
    });
}

router.post('/update/offers/:fissionName', async (request:Request,response:Response) =>
{
    // TODO: The profile is only available after the IPNS link was updated.
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");

    const taskName = "updateOffers_" + request.params.fissionName;

    taskScheduler.addOrResetTask(taskName, 5, async () =>
    {
        const newCid = await updateOfferIndex(request.params.fissionName, inMemoryOfferIndex);
        await fs.writeFile('lastOffersCid.cid', newCid, () =>
        {
            console.log("Wrote last cid (offer index):", newCid);
        });
    });

    response.send("Pending");
});

router.post('/update/profiles/:fissionName', async (request:Request,response:Response) =>
{
    // TODO: The profile is only available after the IPNS link was updated.
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");

    const taskName = "updateProfile_" + request.params.fissionName;

    taskScheduler.addOrResetTask(taskName, 5, async () =>
    {
        const newCid = await updateProfileIndex(request.params.fissionName, inMemoryProfileIndex);
        await fs.writeFile('lastDirectoryCid.cid', newCid, () =>
        {
            console.log("Wrote last cid (profile index):", newCid);
        });
    });

    response.send("Pending");
});

router.get('/profiles', (request:Request,response:Response) =>
{
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");
    response.send(lastProfileIndexCID.toString());
});

router.get('/offers', (request:Request,response:Response) =>
{
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");
    response.send(lastOfferIndexCID.toString());
});


taskScheduler.start();
// add router in the Express app.
app.use("/", router);
app.listen(5009, async () => {
    await init()
});


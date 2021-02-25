import {runWithDrive} from "./fissionDrive";
import {ipfs} from "omo-webnative/dist";

async function getCidFromPath(rootCid:string, publicPath:string)
{
    const ipfs_ = await ipfs.get();
    const file = await ipfs_.files.stat(`/ipfs/${rootCid}/p/${publicPath}`)
    return (<any>file).cid.toString();
}

export async function uploadFileAndGetCid(publicDir:string, filename:string, data:Buffer) : Promise<string>
{
    if (!publicDir || !publicDir.startsWith("public/"))
    {
        throw new Error(`You must supply a path that begins with 'public/'`);
    }
    if (!publicDir.endsWith("/"))
    {
        throw new Error(`The 'publicDir' must end with a trailing slash.`);
    }

    return await runWithDrive(async (fissionDrive) => {
        if (!fissionDrive.fs)
        {
            throw new Error(`Fission drive not properly initialized.`);
        }
        if (!(await fissionDrive.fs.exists(publicDir))){
            await fissionDrive.fs.mkdir(publicDir);
        }
        const destinationPath = publicDir + filename;
        await fissionDrive.fs.add(destinationPath, data, {
            publish: false
        });

        const fsRootCid = await fissionDrive.fs.publish();
        const fileCid = await getCidFromPath(fsRootCid, destinationPath.replace("public/", ""));
        return fileCid;
    });
}
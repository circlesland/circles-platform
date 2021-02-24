import {SendMessageContext} from "../processes/sendMessage";
import {runWithDrive} from "omo-fission/dist/fissionDrive";
import {Generate} from "omo-utils/dist/generate";
import {ipfs} from "omo-webnative/dist";

async function getCidFromPath(rootCid:string, publicPath:string)
{
  const ipfs_ = await ipfs.get();
  const file = await ipfs_.files.stat(`/ipfs/${rootCid}/p/${publicPath}`)
  return (<any>file).cid.toString();
}

export const sendMessageService = async (context:SendMessageContext) => {
  const profile = await context.omoCentral.queryProfileByCirclesAddress(context.data.recipient.value);
  if (!profile) {
    throw new Error(`Couldn't find an omo profile for circles address: ${context.data.recipient.value}`);
  }

  await runWithDrive(async fissionDrive => {
    const outboxPath = "public/Apps/MamaOmo/OmoSapien/Outbox";
    if (!(await fissionDrive.fs.exists(outboxPath))){
      await fissionDrive.fs.mkdir(outboxPath);
    }
    const messageFilename = Generate.randomHexString();
    const outboxMessagePath = outboxPath + "/" + messageFilename;
    await fissionDrive.fs.add(outboxMessagePath, Buffer.from(context.data.text.value, "utf-8"), {
      publish: false
    });
    const fsRootCid = await fissionDrive.fs.publish();
    const messageCid = await getCidFromPath(fsRootCid, outboxMessagePath.replace("public/", ""));

    const sentMessage = await context.omoCentral.sendMessage({
      topic: context.topic,
      toFissionName: profile.fissionName,
      cid: messageCid
    });

    console.log(sentMessage);
  });
}
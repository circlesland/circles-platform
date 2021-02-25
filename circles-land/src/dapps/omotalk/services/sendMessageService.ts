import {SendMessageContext} from "../processes/sendMessage";
import {Generate} from "omo-utils/dist/generate";
import {uploadFileAndGetCid} from "omo-fission/dist/fissionUtil";

export const sendMessageService = async (context:SendMessageContext) => {
  const profile = await context.omoCentral.queryProfileByCirclesAddress(context.data.recipient.value);
  if (!profile) {
    throw new Error(`Couldn't find an omo profile for circles address: ${context.data.recipient.value}`);
  }

  const messageFilename = Generate.randomHexString();
  const messageCid = await uploadFileAndGetCid(
    "public/Apps/MamaOmo/OmoSapien/Outbox/",
    messageFilename,
    Buffer.from(context.data.text.value, "utf-8"));

  const sentMessage = await context.omoCentral.sendMessage({
    namespace: context.namespace,
    topic: context.topic,
    preview: context.data.preview.value,
    toFissionName: profile.fissionName,
    cid: messageCid
  });
}
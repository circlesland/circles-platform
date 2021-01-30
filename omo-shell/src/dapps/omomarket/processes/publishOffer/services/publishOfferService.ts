import {PublishOfferContext} from "../publishOffer";
import {runWithDrive} from "omo-fission/dist/fissionDrive";

export const publishOfferService = async (context: PublishOfferContext) =>
{
  await runWithDrive(async drive => {
    const offer = await drive.offers.tryGetOfferByName(context.data.offerName.value);
    if (!offer)
      throw new Error(`Couldn't find the offer with the name '${context.data.offerName.value}'`);

    await offer.publishOffer();
  });
}

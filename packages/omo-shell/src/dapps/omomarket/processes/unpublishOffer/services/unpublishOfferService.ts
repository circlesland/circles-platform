import {runWithDrive} from "../../../../../libs/o-fission/fissionDrive";
import {UnpublishOfferContext} from "../unpublishOffer";

export const unpublishOfferService = async (context: UnpublishOfferContext) =>
{
  await runWithDrive(async drive => {
    const offer = await drive.offers.tryGetOfferByName(context.data.offerName.value);
    if (!offer)
      throw new Error(`Couldn't find the offer with the name '${context.data.offerName.value}'`);

    await offer.unpublishOffer();
  });
}

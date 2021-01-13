import {runWithDrive} from "../../../../../libs/o-fission/initFission";
import {UnpublishOfferContext} from "../unpublishOffer";

export const unpublishOfferService = async (context: UnpublishOfferContext) =>
{
  await runWithDrive(async drive => {
    await drive.offers.unpublishOffer(context.data.offerName.value);
    await fetch("https://directory.omo.earth/update/offers/" + drive.username, {
      method: "POST"
    });
  });
}

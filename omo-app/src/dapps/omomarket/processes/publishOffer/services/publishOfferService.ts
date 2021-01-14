import {runWithDrive} from "../../../../../libs/o-fission/initFission";
import {PublishOfferContext} from "../publishOffer";

export const publishOfferService = async (context: PublishOfferContext) =>
{
  await runWithDrive(async drive => {
    await drive.offers.publishOffer(context.data.offerName.value);
    await fetch("https://directory.omo.earth/update/offers/" + drive.username, {
      method: "POST"
    });
  });
}

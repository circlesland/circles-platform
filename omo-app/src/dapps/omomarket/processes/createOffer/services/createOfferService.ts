import {CreateOfferContext} from "../createOffer";
import {runWithDrive} from "../../../../../libs/o-fission/initFission";

export const createOfferService = async (context: CreateOfferContext) =>
{
  await runWithDrive(async fissionDrive =>
  {
    var idData = new Uint8Array(16);
    window.crypto.getRandomValues(idData);
    const idBuffer = Buffer.from(idData);

    await fissionDrive.offers.addOrUpdate({
      isPublished: false,
      offeredByFissionName: fissionDrive.username,
      name: idBuffer.toString("hex"),
      productDescription: context.data.productDescription.value,
      productName: context.data.productName.value,
      productPicture: context.data.productPicture.value,
      productPrice: context.data.productPrice.value,
      productLocation: context.data.productLocation.value,
    });
  });
}

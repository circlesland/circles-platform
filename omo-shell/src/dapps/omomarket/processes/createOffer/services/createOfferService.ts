import {CreateOfferContext} from "../createOffer";
import {runWithDrive} from "omo-fission/dist/fissionDrive";

export const createOfferService = async (context: CreateOfferContext) =>
{
  await runWithDrive(async fissionDrive =>
  {
    const offer = await fissionDrive.offers.createOffer(
      context.data.productName.value,
      {
        isPublished: false,
        productDescription: context.data.productDescription.value,
        productLocation: context.data.productLocation.value,
        productName: context.data.productName.value,
        productPrice: context.data.productPrice.value
      }
    );

    if (context.data.productPicture.value)
    {
       await offer.addPicture(Buffer.from(context.data.productPicture.value, "hex"));
    }
  });
}

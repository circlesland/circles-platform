import {CreateOfferContext} from "../createOffer";
import {tryGetDappState} from "../../../../../libs/o-os/loader";
import {FissionAuthState} from "../../../../fissionauth/manifest";

export const createOfferService = async (context: CreateOfferContext) =>
{
  const fissionAuthState = tryGetDappState<FissionAuthState>("omo.fission.auth:1");

  var idData = new Uint8Array(16);
  window.crypto.getRandomValues(idData);
  const idBuffer = Buffer.from(idData);

  await fissionAuthState.fission.offers.addOrUpdate({
    name: idBuffer.toString("hex"),
    productDescription: context.data.productDescription.value,
    productName: context.data.productName.value,
    productPicture: context.data.productPicture.value,
    productPrice: context.data.productPrice.value,
    productLocation: context.data.productLocation.value,
  });
}

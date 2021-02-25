import {CreateOfferContext} from "../processes/createOffer";
import {tryGetDappState} from "omo-kernel/dist/kernel";
import {FissionAuthState} from "omo-fission/dist/manifest";
import {Generate} from "omo-utils/dist/generate";
import {CreateOfferInput} from "omo-central-client/dist/generated";
import {uploadFileAndGetCid} from "omo-fission/dist/fissionUtil";

export const createOfferService = async (context: CreateOfferContext) => {
  const fissionAuth = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  fissionAuth.fissionState.omoCentralClientSubject.subscribe(async api =>
  {
    const pictureFilename = Generate.randomHexString();
    const pictureCid = await uploadFileAndGetCid(
      "public/Apps/MamaOmo/OmoSapien/OfferPictures/",
      pictureFilename,
      Buffer.from(context.data.productPicture.value, "hex"));

    await api.createOffer(<CreateOfferInput>{
      title: context.data.productName.value,
      price: context.data.productPrice.value.toString(),
      description: context.data.productDescription.value,
      city: context.data.productLocation.value.display_name,
      deliveryTerms: "",
      pictures: [{
        cid: pictureCid
      }]
    });
  });
}

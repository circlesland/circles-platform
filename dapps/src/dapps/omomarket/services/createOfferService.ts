import {CreateOfferContext} from "../processes/createOffer";
import {Generate} from "omo-utils/dist/generate";
import {CreateOfferInput} from "omo-central/dist/generated";
import {uploadFileAndGetCid} from "omo-fission/dist/fissionUtil";
import {OmoCentral} from "omo-central/dist/omoCentral";

export const createOfferService = async (context: CreateOfferContext) => {
  const api = await OmoCentral.instance.subscribeToResult();
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
}

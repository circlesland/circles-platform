import {CreateOfferContext} from "../processes/createOffer";
import {tryGetDappState} from "omo-kernel/dist/kernel";
import {FissionAuthState} from "omo-fission/dist/manifest";
import {runWithDrive} from "omo-fission/dist/fissionDrive";
import {Generate} from "omo-utils/dist/generate";
import {ipfs} from "omo-webnative/dist";
import {UpsertOfferInput} from "omo-central-client/dist/generated";

async function getCidFromPath(rootCid:string, publicPath:string)
{
  const ipfs_ = await ipfs.get();
  const file = await ipfs_.files.stat(`/ipfs/${rootCid}/p/${publicPath}`)
  return (<any>file).cid.toString();
}

export const createOfferService = async (context: CreateOfferContext) => {
  const fissionAuth = tryGetDappState<FissionAuthState>("omo.fission.auth:1");
  fissionAuth.fissionState.omoCentralClientSubject.subscribe(async api => {

    await runWithDrive(async fissionDrive => {
      const pictureFilename = Generate.randomHexString();
      const picturePath = "public/Apps/MamaOmo/OmoSapien/OfferPictures/" + pictureFilename;
      await fissionDrive.fs.add(picturePath, Buffer.from(context.data.productPicture.value, "hex"), {
        publish: false
      });

      const fsRootCid = await fissionDrive.fs.publish();
      const pictureCid = await getCidFromPath(fsRootCid, picturePath.replace("public/", ""));

      await api.upsertOffer(<UpsertOfferInput>{
        title: context.data.productName.value,
        price: context.data.productPrice.value.toString(),
        description: context.data.productDescription.value,
        city: context.data.productLocation.value,
        deliveryTerms: "",
        pictures: [{
          cid: pictureCid
        }]
      });
    });
  });
}

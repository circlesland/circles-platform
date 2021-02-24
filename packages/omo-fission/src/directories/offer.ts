import {Directory, DirectoryChangeType} from "./directory";
import {Entity} from "omo-models/dist/omo/entity";
import FileSystem from "omo-webnative/dist/fs";
import {Generate} from "omo-utils/dist/generate";
import {OfferMetadata} from "./offer/offerMetadata";
import {OfferDescription} from "./offer/offerDescription";
import {BinaryFile} from "./binaryFile";

export class Offer extends Directory<OfferMetadata | BinaryFile> implements Entity
{
    private _cachedMetadata?: OfferMetadata;
    readonly name: string;

    constructor(name: string,
                fissionUser: string,
                fs: FileSystem,
                offerMetadata?:OfferMetadata)
    {
        super(fissionUser, fs, ["offers", name]);
        this.name = name;
        this._cachedMetadata = offerMetadata;
    }

    async tryGetMetadata(): Promise<OfferMetadata | undefined>
    {
        if (this._cachedMetadata)
        {
            return this._cachedMetadata;
        }

        this._cachedMetadata = await this.tryGetEntityByName<OfferMetadata>("metadata");
        return this._cachedMetadata;
    }

    protected async setMetadata(offerMetadata: OfferMetadata)
    {
        offerMetadata.owner = this._fissionUser;
        offerMetadata.lastUpdatedAt = new Date().toJSON();
        offerMetadata.name = "metadata";
        this._cachedMetadata = offerMetadata;

        return await this.addOrUpdateEntity(this._cachedMetadata);
    }

    async setDescription(description: OfferDescription)
    {
        if (this._cachedMetadata)
        {
            this._cachedMetadata.description = description;
        }
        else
        {
            await this.tryGetMetadata();
        }

        if (!this._cachedMetadata)
        {
            throw new Error("The offer has no metadata yet. You need to create a metadata file first before setting a description.");
        }

        await this.setMetadata(this._cachedMetadata);
    }

    async addPicture(pictureData: Buffer): Promise<{
        pictureFilename: string
        fsRootCid: string
    }>
    {
        const metadata = await this.tryGetMetadata();
        if (!metadata)
        {
            throw new Error("A 'metadata' file must exist prior to adding pictures to an offer.");
        }
        if (!metadata.pictures)
        {
            metadata.pictures = [];
        }

        const pictureFilename = Generate.randomHexString();
        await this.addOrUpdateFile(pictureFilename, pictureData);

        metadata.pictures.push({
            file: {
                name: pictureFilename
            }
        });

        const updateMetdataResult = await this.setMetadata(metadata);
        if (!updateMetdataResult.fsRootCid)
        {
            throw new Error(`It is expected that the call to setMetadata() also calls publish(). No fsRootCid.`);
        }

        return {
            pictureFilename: pictureFilename,
            fsRootCid: updateMetdataResult.fsRootCid
        };
    }

    async removePicture(name: string)
    {
        const metadata = await this.tryGetMetadata();
        if (!metadata || !metadata.pictures)
        {
            throw new Error("A 'metadata' file must exist prior to editing pictures of an offer.");
        }
        if (!await this.exists([name]) || metadata.pictures.find(o => o.file.name == name))
        {
            throw new Error("A product picture with the name '" + name + "' doesn't exist.")
        }
        await this.tryRemove(name);
    }

    async publishOffer()
    {
        const sourcePath = this.getPath();
        const destinationPath = `public/Apps/MamaOmo/OmoSapien/offers/${this.name}/`;

        await this.copyDirectory(sourcePath, destinationPath);

        const currentMetadata = await this.tryGetMetadata();
        if (!currentMetadata)
        {
            throw new Error(`Cannot publish offer '${this.name}' because the offer's metadata file couldn't be found at '${this.getPath([this.name])}'.`)
        }

        await this.setDescription({
            ...currentMetadata.description,
            isPublished: true
        });

        await fetch("https://directory.omo.earth/update/offers/" + this._fissionUser, {
            method: "POST"
        });
    }

    async unpublishOffer()
    {
        const destinationPath = `public/Apps/MamaOmo/OmoSapien/offers/${this.name}/`;
        await this.fs.rm(destinationPath);

        const currentMetadata = await this.tryGetMetadata();
        if (!currentMetadata)
        {
            throw new Error(`Cannot unpublish offer '${this.name}' because the offer's metadata file couldn't be found at '${this.getPath([this.name])}'.`)
        }
        await this.setDescription({
            ...currentMetadata.description,
            isPublished: false
        });

        await fetch("https://directory.omo.earth/update/offers/" + this._fissionUser, {
            method: "POST"
        });
    }

    async maintainIndexes(change: DirectoryChangeType, entity: OfferMetadata | BinaryFile, indexHint?: string)
    {
    }
}
import {BinaryFile} from "../binaryFile";

export interface OfferPicture
{
    width?: number;
    height?: number;
    title?: string;
    description?: string;
    file: BinaryFile;
}
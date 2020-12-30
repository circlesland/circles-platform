import { FileInfo, FileHeader, PutDetails } from '../protocol/public/types';
import { CID, FileContent } from '../../ipfs';
import BaseFile from '../base/file';
import PublicHistory from './PublicHistory';
import { Maybe } from '../../common';
declare type ConstructorParams = {
    cid: Maybe<CID>;
    content: FileContent;
    header: FileHeader;
};
export declare class PublicFile extends BaseFile {
    cid: Maybe<CID>;
    header: FileHeader;
    history: PublicHistory;
    constructor({ content, header, cid }: ConstructorParams);
    static instanceOf(obj: any): obj is PublicFile;
    static create(content: FileContent): Promise<PublicFile>;
    static fromCID(cid: CID, timeout: Maybe<number>): Promise<PublicFile>;
    static fromInfo(info: FileInfo, cid: CID, timeout: Maybe<number>): Promise<PublicFile>;
    putDetailed(timeout: Maybe<number>): Promise<PutDetails>;
}
export default PublicFile;

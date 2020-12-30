import { AddResult, CID, FileContent } from '../../ipfs';
import BaseFile from '../base/file';
import { Maybe } from '../../common';
export declare class BareFile extends BaseFile {
    static create(content: FileContent): BareFile;
    static fromCID(cid: CID, timeout: Maybe<number>): Promise<BareFile>;
    static instanceOf(obj: any): obj is BareFile;
    put(timeout: Maybe<number>): Promise<CID>;
    putDetailed(timeout: Maybe<number>): Promise<AddResult>;
}
export default BareFile;

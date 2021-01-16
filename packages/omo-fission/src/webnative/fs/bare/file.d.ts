import { AddResult, CID, FileContent } from '../../ipfs';
import BaseFile from '../base/file';
export declare class BareFile extends BaseFile {
    static create(content: FileContent): BareFile;
    static fromCID(cid: CID): Promise<BareFile>;
    static instanceOf(obj: any): obj is BareFile;
    put(): Promise<CID>;
    putDetailed(): Promise<AddResult>;
}
export default BareFile;

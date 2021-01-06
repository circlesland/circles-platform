/** @internal */
/** @internal */
import { File } from '../types';
import { AddResult, CID, FileContent } from '../../ipfs';
export declare abstract class BaseFile implements File {
    content: FileContent;
    constructor(content: FileContent);
    put(): Promise<CID>;
    updateContent(content: FileContent): Promise<this>;
    abstract putDetailed(): Promise<AddResult>;
}
export default BaseFile;

/** @internal */
/** @internal */
import { File } from '../types';
import { AddResult, CID, FileContent } from '../../ipfs';
import { Maybe } from "../../common";
export declare abstract class BaseFile implements File {
    content: FileContent;
    constructor(content: FileContent);
    put(timeout: Maybe<number>): Promise<CID>;
    updateContent(content: FileContent, timeout: Maybe<number>): Promise<this>;
    abstract putDetailed(timeout: Maybe<number>): Promise<AddResult>;
}
export default BaseFile;

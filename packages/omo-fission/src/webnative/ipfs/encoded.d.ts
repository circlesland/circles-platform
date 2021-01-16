import { Maybe } from '../common/types';
import { CID, FileContent, AddResult } from './types';
export declare const add: (content: FileContent, key: Maybe<string>) => Promise<AddResult>;
export declare const catAndDecode: (cid: CID, key: Maybe<string>) => Promise<unknown>;

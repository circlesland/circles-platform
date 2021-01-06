/** @internal */
import { CID, FileContent, AddResult } from '../../ipfs';
import { SimpleLinks, Links } from '../types';
export declare const getFile: (cid: CID) => Promise<FileContent>;
export declare const getEncryptedFile: (cid: CID, key: string) => Promise<FileContent>;
export declare const putFile: (content: FileContent) => Promise<AddResult>;
export declare const putEncryptedFile: (content: FileContent, key: string) => Promise<AddResult>;
export declare const getSimpleLinks: (cid: CID) => Promise<SimpleLinks>;
export declare const getLinks: (cid: CID) => Promise<Links>;
export declare const putLinks: (links: Links | SimpleLinks) => Promise<AddResult>;

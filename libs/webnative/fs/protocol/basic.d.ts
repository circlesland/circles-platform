/** @internal */
import { CID, FileContent, AddResult } from '../../ipfs';
import { SimpleLinks, Links } from '../types';
import { Maybe } from "../../common";
export declare const getFile: (cid: CID, timeout: Maybe<number>) => Promise<FileContent>;
export declare const getEncryptedFile: (cid: CID, key: string, timeout: Maybe<number>) => Promise<FileContent>;
export declare const putFile: (content: FileContent, timeout: Maybe<number>) => Promise<AddResult>;
export declare const putEncryptedFile: (content: FileContent, key: string, timeout: Maybe<number>) => Promise<AddResult>;
export declare const getSimpleLinks: (cid: CID, timeout: Maybe<number>) => Promise<SimpleLinks>;
export declare const getLinks: (cid: CID, timeout: Maybe<number>) => Promise<Links>;
export declare const putLinks: (links: Links | SimpleLinks, timeout: Maybe<number>) => Promise<AddResult>;

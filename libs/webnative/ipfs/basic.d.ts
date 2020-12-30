/// <reference types="node" />
import { CID, FileContent, DAGNode, UnixFSFile, DAGLink, AddResult } from './types';
import { Maybe } from "../common";
export declare const add: (content: FileContent, timeout: Maybe<number>) => Promise<AddResult>;
export declare const catRaw: (cid: CID, timeout: Maybe<number>) => Promise<Buffer[]>;
export declare const catBuf: (cid: CID, timeout: Maybe<number>) => Promise<Buffer>;
export declare const cat: (cid: CID, timeout: Maybe<number>) => Promise<string>;
export declare const ls: (cid: CID, timeout: Maybe<number>) => Promise<UnixFSFile[]>;
export declare const dagGet: (cid: CID, timeout: Maybe<number>) => Promise<DAGNode>;
export declare const dagPut: (node: DAGNode, timeout: Maybe<number>) => Promise<AddResult>;
export declare const dagPutLinks: (links: DAGLink[], timeout: Maybe<number>) => Promise<AddResult>;
export declare const size: (cid: CID, timeout: Maybe<number>) => Promise<number>;
export declare const reconnect: () => Promise<void>;
export declare const attemptPin: (cid: CID, timeout: Maybe<number>) => Promise<void>;

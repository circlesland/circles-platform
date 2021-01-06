/// <reference types="node" />
import { CID, FileContent, DAGNode, UnixFSFile, DAGLink, AddResult } from './types';
export declare const add: (content: FileContent) => Promise<AddResult>;
export declare const catRaw: (cid: CID) => Promise<Buffer[]>;
export declare const catBuf: (cid: CID) => Promise<Buffer>;
export declare const cat: (cid: CID) => Promise<string>;
export declare const ls: (cid: CID) => Promise<UnixFSFile[]>;
export declare const dagGet: (cid: CID) => Promise<DAGNode>;
export declare const dagPut: (node: DAGNode) => Promise<AddResult>;
export declare const dagPutLinks: (links: DAGLink[]) => Promise<AddResult>;
export declare const size: (cid: CID) => Promise<number>;
export declare const reconnect: () => Promise<void>;
export declare const attemptPin: (cid: CID) => Promise<void>;

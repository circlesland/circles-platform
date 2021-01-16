/// <reference types="node" />
export declare type IPFS = {
    add(data: FileContent, options?: unknown): UnixFSFile;
    cat(cid: CID): AsyncIterable<FileContentRaw>;
    ls(cid: CID): AsyncIterable<UnixFSFile>;
    dns(domain: string): Promise<CID>;
    dag: DagAPI;
    files: FilesAPI;
    object: ObjectAPI;
    pin: PinAPI;
    swarm: SwarmAPI;
};
export declare type DAGNode = {
    Links: DAGLink[];
    size: number;
    toDAGLink: (opt?: {
        name?: string;
    }) => Promise<DAGLink>;
    addLink: (link: DAGLink) => void;
    rmLink: (name: string) => void;
    toJSON: () => Record<string, unknown>;
};
export declare type DAGLink = {
    Name: string;
    Hash: CIDObj;
    Tsize: number;
};
export declare type RawDAGNode = {
    remainderPath: string;
    value: {
        Data: Uint8Array;
        Links: RawDAGLink[];
        _size: number;
        _serializedSize: number;
    };
};
export declare type RawDAGLink = {
    Name: string;
    Hash: CIDObj;
    Tsize: number;
};
export interface DagAPI {
    put(dagNode: unknown, options?: unknown): Promise<CIDObj>;
    get(cid: string | CID | CIDObj, path?: string, options?: unknown): Promise<RawDAGNode>;
    resolve(cid: string | CID | CIDObj): Promise<{
        cid: CIDObj;
    }>;
    tree(cid: string | CID | CIDObj, path?: string, options?: unknown): Promise<Array<string>>;
}
export interface FilesAPI {
    stat: (cid: CID | CIDObj) => Promise<{
        cumulativeSize: number;
    }>;
}
export interface ObjectAPI {
    stat(cid: CID | CIDObj): Promise<ObjStat>;
    put(dagNode: unknown, options: unknown): Promise<CIDObj>;
    get(cid: CID, path?: string, options?: unknown): Promise<RawDAGNode>;
    tree(cid: CID, path?: string, options?: unknown): Promise<unknown>;
}
export interface PinAPI {
    add(cid: CID | CIDObj, opts?: {
        recursive?: boolean;
    }): Promise<Array<CIDObj>>;
}
export declare type CID = string;
export declare type Codec = string;
export declare type MultibaseName = string;
export declare type CIDObj = {
    codec: Codec;
    multibaseName: MultibaseName;
    version: number;
    toV1(): CIDObj;
    toString(): string;
};
export declare type FileContent = Record<string, unknown> | Buffer | Blob | string | number | boolean;
export declare type FileContentRaw = Buffer;
export declare type FileMode = number;
export declare type UnixFSFile = {
    cid: CIDObj;
    path: string;
    size: number;
    mode?: FileMode;
    mtime?: number;
    name?: string;
    type?: string;
};
export declare type ObjStat = {
    Hash: string;
    NumLinks: number;
    BlockSize: number;
    LinksSize: number;
    DataSize: number;
    CumulativeSize: number;
};
export declare type AddResult = {
    cid: CID;
    size: number;
    isFile: boolean;
};
export declare type SwarmAPI = {
    connect: (address: string) => Promise<unknown>;
};

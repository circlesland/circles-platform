import { Metadata } from '../../metadata';
import { AddResult, CID } from '../../../ipfs';
export declare type PutDetails = AddResult & {
    userland: CID;
    metadata: CID;
    isFile: boolean;
    skeleton: Skeleton;
};
export declare type SkeletonInfo = {
    cid: CID;
    userland: CID;
    metadata: CID;
    subSkeleton: Skeleton;
    isFile: boolean;
};
export declare type Skeleton = {
    [name: string]: SkeletonInfo;
};
export declare type TreeHeader = {
    metadata: Metadata;
    previous?: CID;
    skeleton: Skeleton;
};
export declare type TreeInfo = TreeHeader & {
    userland: CID;
};
export declare type FileHeader = {
    metadata: Metadata;
    previous?: CID;
};
export declare type FileInfo = FileHeader & {
    userland: CID;
};

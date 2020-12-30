import { BaseLink } from "../../types";
import { Metadata } from '../../metadata';
import { AddResult, CID } from "../../../ipfs";
import { BareNameFilter, PrivateName } from './namefilter';
export declare type DecryptedNode = PrivateFileInfo | PrivateTreeInfo;
export declare type PrivateFileInfo = {
    content: CID;
    metadata: Metadata;
    bareNameFilter: BareNameFilter;
    revision: number;
    key: string;
};
export declare type PrivateLink = BaseLink & {
    key: string;
    pointer: PrivateName;
};
export declare type PrivateLinks = {
    [name: string]: PrivateLink;
};
export declare type PrivateTreeInfo = {
    metadata: Metadata;
    bareNameFilter: BareNameFilter;
    revision: number;
    links: PrivateLinks;
    skeleton: PrivateSkeleton;
};
export declare type PrivateSkeleton = {
    [name: string]: PrivateSkeletonInfo;
};
export declare type PrivateSkeletonInfo = {
    cid: CID;
    key: string;
    subSkeleton: PrivateSkeleton;
};
export declare type PrivateAddResult = AddResult & {
    name: PrivateName;
    key: string;
    skeleton: PrivateSkeleton;
};
export declare type Revision = {
    cid: CID;
    name: PrivateName;
    number: number;
};

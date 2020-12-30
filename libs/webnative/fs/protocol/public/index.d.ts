/** @internal */
/** @internal */
import { Links } from '../../types';
import { TreeInfo, FileInfo, Skeleton, PutDetails } from './types';
import { Metadata } from '../../metadata';
import { Maybe } from '../../../common';
import { CID, FileContent } from '../../../ipfs';
export declare const putTree: (links: Links, skeletonVal: Skeleton, metadataVal: Metadata, previousCID: Maybe<CID>, timeout: Maybe<number>) => Promise<PutDetails>;
export declare const putFile: (content: FileContent, metadataVal: Metadata, previousCID: Maybe<CID>, timeout: Maybe<number>) => Promise<PutDetails>;
export declare const putAndMakeLink: (name: string, val: FileContent, timeout: Maybe<number>) => Promise<import("../../types").Link>;
export declare const get: (cid: CID, timeout: Maybe<number>) => Promise<TreeInfo | FileInfo>;
export declare const getValue: (linksOrCID: Links | CID, name: string, timeout: Maybe<number>) => Promise<unknown>;
export declare const getValueFromLinks: (links: Links, name: string, timeout: Maybe<number>) => Promise<unknown>;
export declare const getAndCheckValue: <T>(linksOrCid: Links | CID, name: string, checkFn: (val: any) => val is T, canBeNull: boolean | undefined, timeout: Maybe<number>) => Promise<T>;
export declare const checkValue: <T>(val: any, name: string, checkFn: (val: any) => val is T, canBeNull?: boolean) => T;

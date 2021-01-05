import { DAGLink, UnixFSFile } from '../ipfs';
import { Link, SimpleLink } from './types';
export declare const toDAGLink: (link: SimpleLink) => DAGLink;
export declare const fromFSFile: (fsObj: UnixFSFile) => Link;
export declare const fromDAGLink: (link: DAGLink) => SimpleLink;
export declare const make: (name: string, cid: string, isFile: boolean, size: number) => Link;
declare type HasName = {
    name: string;
};
export declare const arrToMap: <T extends HasName>(arr: T[]) => {
    [name: string]: T;
};
export {};

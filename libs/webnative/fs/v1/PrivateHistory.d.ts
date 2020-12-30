import MMPT from "../protocol/private/mmpt";
import { BareNameFilter } from '../protocol/private/namefilter';
import { DecryptedNode, Revision } from "../protocol/private/types";
import { Maybe } from '../../common';
import { Metadata } from '../metadata';
export declare type Node = {
    constructor: {
        fromInfo: (mmpt: MMPT, key: string, info: DecryptedNode) => Node;
    };
    header: {
        bareNameFilter: BareNameFilter;
        metadata: Metadata;
        revision: number;
    };
    key: string;
    mmpt: MMPT;
};
export default class PrivateHistory {
    readonly node: Node;
    constructor(node: Node);
    /**
     * Go back one or more versions.
     *
     * @param delta Optional negative number to specify how far to go back
     */
    back(delta: number | undefined, timeout: Maybe<number>): Promise<Maybe<Node>>;
    /**
     * Get a version before a given timestamp.
     *
     * @param timestamp Unix timestamp in seconds
     */
    prior(timestamp: number, timeout: Maybe<number>): Promise<Maybe<Node>>;
    /**
     * List earlier versions along with the timestamp they were created.
     */
    list(amount: Maybe<number>, timeout: Maybe<number>): Promise<Array<{
        delta: number;
        timestamp: number;
    }>>;
    /**
     * @internal
     */
    _getRevision(revision: number, timeout: Maybe<number>): Promise<Maybe<Node>>;
    /**
     * @internal
     */
    _getRevisionInfo(revision: Revision): Promise<DecryptedNode>;
    /**
     * @internal
     */
    _getRevisionInfoFromNumber(revision: number, timeout: Maybe<number>): Promise<Maybe<DecryptedNode>>;
    /**
     * @internal
     */
    _prior(revision: number, timestamp: number, timeout: Maybe<number>): Promise<Maybe<Node>>;
}

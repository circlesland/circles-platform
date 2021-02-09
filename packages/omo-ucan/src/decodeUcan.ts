/**
 * Given a list of UCANs, generate a dictionary.
 * The key will be in the form of `${resourceKey}:${resourceValue}`
 */
import {Ucan} from "./types";

export function makeUrlUnsafe(a: string): string {
    return a.replace(/_/g, "/").replace(/-/g, "+")
}

export function makeUrlSafe(a: string): string {
    return a.replace(/\//g, "_").replace(/\+/g, "-").replace(/=+$/, "")
}

/**
 * Try to decode a UCAN.
 * Will throw if it fails.
 *
 * @param ucan The encoded UCAN to decode
 */
export function decodeUcan(ucan: string): Ucan
{
    const split = ucan.split(".")
    const header = JSON.parse(Buffer.from(makeUrlUnsafe(split[0]), "base64").toString("ascii"))
    const payload = JSON.parse(Buffer.from(makeUrlUnsafe(split[1]), "base64").toString("ascii"))

    return {
        header,
        payload,
        signature: makeUrlUnsafe(split[2])
    }
}

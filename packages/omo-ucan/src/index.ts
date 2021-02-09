import {Resource} from "./types";

export const buildUcan:(signingKey:string, args:{
    audience: string
    facts?: Array<any>
    issuer: string
    lifetimeInSeconds?: number
    potency?: string | null
    proof?: string
    resource?: Resource
}) => Promise<string> = require("../dist/buildUcan").buildUcan;

export const verifyUcan:(ucan:string, myDid:string) => string[] = require("../dist/verifyUcan").verifyUcan;
export const stripPem:(pemKey:string)=>string = require("../dist/verifyUcan").stripPem;
export const publicKeyToDid:(base64PublicKey:string) => string = require("../dist/didHelper").publicKeyToDid;
export const didToPublicKey:(did:string)=>string = require("../dist/didHelper").didToPublicKey;

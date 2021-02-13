import { PrismaClient } from '@prisma/client'
import {Resolvers} from "./types";
import {verifyUcan} from "omo-ucan/dist/index";

const prisma = new PrismaClient()
const myDid = "";

export const resolvers : Resolvers = {
    Query: {
        omo: (parent, args) => {
            return {};
        },
        profiles: async (parent, args) => {
            const q:{[key:string]:any} = {};
            if (!args.fields)
            {
                throw new Error(``);
            }
            Object.keys(args.fields ?? {})
                .map(key => {
                    return {
                        key: key,
                        // @ts-ignore
                        value: args.fields[key]
                    }
                })
                .filter(kv => kv.value)
                .forEach(kv => {
                    q[kv.key] = kv.value;
                });

            return await prisma.profile.findMany({
                where: {
                    ...q
                }
            });
        },
        fissionRoot: async (parent, args) => {
            const q = {};
            Object.keys(args.fields)
                .map(key => {
                    return {
                        key: key,
                        value: args.fields[key]
                    }
                })
                .filter(kv => kv.value)
                .forEach(kv => {
                    q[kv.key] = kv.value;
                });

            const result = await prisma.profile.findUnique({
                where: {
                    ...q
                },
                select: {
                    fissionRoot: true
                }
            });

            if (!result?.fissionRoot)
            {
                throw new Error("");
            }
            return result.fissionRoot;
        }
    },
    Mutation: {
        updateProfile: (parent, args) =>
        {
            if (!args.jwt || args.jwt == "")
            {
                throw new Error("No jwt was supplied");
            }

            const verifyResult = verifyUcan(args.jwt, myDid);
            return {
                // TODO: rsc can be '"' or Record<string, string>
                fissionName: verifyResult.decoded.payload.rsc.toString()
            };
        }
    },
    Omo: {
        __isTypeOf: (obj) => {
            return <any>"";
        },
        did: (parent, args) => {
            return <any>"";
        }
    },
    Profile: {
        __isTypeOf: obj => {
            return <any>"";
        },
        /*did: (parent, args) => {
            return <any>"";
        },*/
        circlesAddress: (parent, args) => {
            return <any>"";
        },
        fissionName: (parent, args) => {
            return <any>"";
        },
        fissionRoot: (parent, args) => {
            return <any>"";
        },
        omoAvatarCID: (parent, args) => {
            return <any>"";
        },
        omoFirstName: (parent, args) => {
            return <any>"";
        },
        omoLastName: (parent, args) => {
            return <any>"";
        }
    }
};

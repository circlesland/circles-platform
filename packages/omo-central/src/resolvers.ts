import { PrismaClient } from '@prisma/client'
import {QueryProfilesArgs, RequireFields, Resolvers} from "./types";
import {verifyUcan} from "omo-ucan/dist/index";

const prisma = new PrismaClient()

function createWhereObject(args: RequireFields<QueryProfilesArgs, never>) {
    const q: { [key: string]: any } = {};
    if (!args.fields) {
        throw new Error(`No query fields have been specified`);
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

    if (Object.keys(q).length === 0) {
        throw new Error(`At least one query field must be specified.`);
    }
    return q;
}

const serverDid = "did:key:zStEZpzSMtTt9k2vszgvCwF4fLQQSyA15W5AQ4z3AR6Bx4eFJ5crJFbuGxKmbma4";

export const resolvers : Resolvers = {
    Query: {
        omo: (parent, args) => {
            return {
                did: serverDid
            };
        },
        profiles: async (parent, args) => {
            const q = createWhereObject(args);
            return await prisma.profile.findMany({
                where: {
                    ...q
                }
            });
        },
        fissionRoot: async (parent, args) => {
            const q = createWhereObject(args);
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
        updateProfile: async (parent, args) =>
        {
            if (!args.jwt || args.jwt == "")
            {
                throw new Error("No jwt was supplied");
            }

            if (!args.data)
            {
                throw new Error(`No arguments.`)
            }

            const verifyResult = await verifyUcan(args.jwt, serverDid);
            if (!verifyResult.isValid)
            {
                console.log(`Invalid ucan '${args.jwt}'.`);
                verifyResult.errors.forEach((message:string) => console.log("Verification problem: ", message));
                throw new Error(`Invalid ucan.`);
            }

            console.log(verifyResult.decoded);

            const fissionNameFromUcan = <Record<string,string>>verifyResult.decoded.payload.rsc;
            const fissionUsername = fissionNameFromUcan["username"];
            if (!fissionUsername || fissionUsername.trim() == "")
            {
                throw new Error("No fission username was included in the UCAN's 'rsc'-claim. The 'rsc' claim must contain an object with 'username' property.")
            }

            let profile = await prisma.profile.findUnique({
                where:{
                    fissionName: fissionUsername
                },
                select: {
                    fissionName: true,
                    circlesAddress: true,
                    omoAvatarCID: true,
                    fissionRoot: true,
                    omoFirstName: true,
                    omoLastName: true
                }
            });

            if (!profile)
            {
                profile = {
                    circlesAddress: args.data.circlesAddress ?? "",
                    fissionName: fissionUsername,
                    fissionRoot: args.data.fissionRoot ?? null,
                    omoAvatarCID: args.data.omoAvatarCID ?? null,
                    omoFirstName: args.data.omoFirstName ?? null,
                    omoLastName: args.data.omoLastName ?? null
                };
                profile = await prisma.profile.create({
                    data: profile
                });
            }
            else
            {
                profile = {
                    ...profile,
                    ...args.data
                }
                profile = await prisma.profile.update({
                    where:{
                        fissionName: profile.fissionName
                    },
                    data: profile
                });
            }

            return profile
        }
    },
    Omo: {
        __isTypeOf: (obj) => {
            return obj.did === serverDid;
        },
        did: (parent, args) => {
            return serverDid;
        }
    },
    Profile: {
        __isTypeOf: obj => {
            return obj.fissionName !== 'undefined';
        },
        /*did: (parent, args) => {
            return <any>"";
        },*/
        circlesAddress: (parent, args) => {
            return parent.circlesAddress ?? "";
        },
        fissionName: (parent, args) => {
            return parent.fissionName ?? "";
        },
        fissionRoot: (parent, args) => {
            return parent.fissionRoot ?? "";
        },
        omoAvatarCID: (parent, args) => {
            return parent.omoAvatarCID ?? "";
        },
        omoFirstName: (parent, args) => {
            return parent.omoFirstName ?? "";
        },
        omoLastName: (parent, args) => {
            return parent.omoLastName ?? "";
        }
    }
};

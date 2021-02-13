import { PrismaClient } from '@prisma/client'
import {Profile, QueryProfilesArgs, RequireFields, Resolvers} from "./types";
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

const serverDid = "did:key:z13V3Sog2YaUKhdGCmgx9UZuW1o1ShFJYc6DvGYe7NTt689NoL3BXcUQBZ85Rhs2NFwee4cjCvPSuf3aHu7DHzg5MCZnFwZ5ae2aeCEyatEK8bZwdMHfTgHqeoAjCkYYsq6QGtDfjNDxoqRwv4zFqvQDf7qWmJpxWVae75fmZY6kSSnGzsTmmzPBAbF6zqT5p6Xr4GXypQUBmHrwW7M5wpBFs8RsUQdF7n3JbCAwzBWsQGgrvdyFm6hQCN7qyBpgsh3jjnVi32uQkUu98ZCPTT5DWni2mynFNFMXKP3Rqv8a1doM19JPNu6HyxwupGZ7tyqrRZvQvRQStEMPsDBvsbxmJhwEmq69it7V6Y4fi8VwBrrK4gfBW2AMJpa1qfHHUP9ZBWVYYGwuSMPJ4c19Xe8";

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

            const fissionNameFromUcan = verifyResult.decoded.payload.rsc.toString();
            let profile = await prisma.profile.findUnique({
                where:{
                    fissionName: fissionNameFromUcan
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
                    fissionName: verifyResult.decoded.payload.rsc.toString(),
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

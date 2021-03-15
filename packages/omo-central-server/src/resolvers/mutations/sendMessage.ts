import {MutationSendMessageArgs} from "omo-central-interfaces/dist/types";
import {Context} from "../../context";
import {PrismaClient} from "@prisma/client";
import {EventBroker} from "omo-utils/dist/eventBroker";

export function sendMessageResolver(prisma:PrismaClient, eventBroker:EventBroker) {
    return async (parent:any, args:MutationSendMessageArgs, context:Context) => {
        const fissionUsername = await context.verifyJwt();
        const message = await prisma.message.create({
            data: {
                senderFissionName: fissionUsername,
                createdAt: new Date(),
                recipientFissionName: args.data.toFissionName,
                topic: args.data.topic,
                type: args.data.type,
                content: args.data.content
            }
        });
        let topic = eventBroker.tryGetTopic(args.data.toFissionName, "messages");
        if (topic) {
            topic.publish(message);
        }

        // Create the contact objects on both sides if not existing

        const senderProfile = await prisma.profile.findUnique({
            where: {
                fissionName: fissionUsername
            }
        });
        if (!senderProfile) {
            throw new Error(`The sender profile with the name '${fissionUsername}' couldn't be found.`)
        }

        const recipientProfile = await prisma.profile.findUnique({
            where: {
                fissionName: args.data.toFissionName
            }
        });
        if (!recipientProfile) {
            throw new Error(`The recipient profile with the name '${args.data.toFissionName}' couldn't be found.`)
        }

        let existingSenderContact = await prisma.contact.findMany({
            where: {
                anchorProfile: {
                    fissionName: fissionUsername
                },
                contactProfile: {
                    fissionName: args.data.toFissionName
                }
            }
        });
        if (existingSenderContact.length == 0) {
            await prisma.contact.create({
                data: {
                    anchorProfile: {
                        connect: {
                            fissionName: fissionUsername
                        }
                    },
                    contactProfile: {
                        connect: {
                            fissionName: args.data.toFissionName
                        }
                    },
                    createdAt: new Date(),
                    createdByKey: "",
                    createdByType: "",
                    displayName: `${recipientProfile.omoFirstName} ${recipientProfile.omoLastName}`,
                    isMuted: false
                }
            });
        }


        const existingRecipientContact = await prisma.contact.findMany({
            where: {
                anchorProfile: {
                    fissionName: args.data.toFissionName
                },
                contactProfile: {
                    fissionName: fissionUsername
                }
            }
        });
        if (existingRecipientContact.length == 0) {
            await prisma.contact.create({
                data: {
                    anchorProfile: {
                        connect: {
                            fissionName: args.data.toFissionName
                        }
                    },
                    contactProfile: {
                        connect: {
                            fissionName: fissionUsername
                        }
                    },
                    createdAt: new Date(),
                    createdByKey: "",
                    createdByType: "",
                    displayName: `${senderProfile.omoFirstName} ${senderProfile.omoLastName}`,
                    isMuted: false
                }
            });
        }

        return <any>{
            ...message,
            createdAt: message.createdAt.toJSON(),
            readAt: message.readAt?.toJSON()
        };
    };
}
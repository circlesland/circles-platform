import {PrismaClient} from "@prisma/client";

export const prisma_ro: PrismaClient = new PrismaClient({
    datasources: {
        db: {
            url: process.env.CONNECTION_STRING_RO
        }
    }
});

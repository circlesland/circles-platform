import {PrismaClient} from "@prisma/client";

export const prisma_rw: PrismaClient = new PrismaClient({
    datasources: {
        db: {
            url: process.env.CONNECTION_STRING_RW
        }
    }
});

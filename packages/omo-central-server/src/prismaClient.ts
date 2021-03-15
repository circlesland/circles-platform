import {PrismaClient} from "@prisma/client";

export const prisma: PrismaClient = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://" + process.env.AUTH_POSTGRES_USER + ":" + process.env.AUTH_POSTGRES_PASSWORD + "@" + process.env.AUTH_POSTGRES_HOST + ":5432/" + process.env.AUTH_POSTGRES_DB + "?schema=public"
        }
    }
});

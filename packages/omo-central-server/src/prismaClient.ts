import {PrismaClient} from "@prisma/client";

const connectionString = "postgresql://" + process.env.AUTH_POSTGRES_USER + ":" + process.env.AUTH_POSTGRES_PASSWORD + "@" + process.env.AUTH_POSTGRES_HOST + ":"+ process.env.AUTH_POSTGRES_PORT + "/" + process.env.AUTH_POSTGRES_DB + "?schema=public&sslmode=prefer";
//console.log(connectionString);
export const prisma: PrismaClient = new PrismaClient({
    datasources: {
        db: {
            url: connectionString
        }
    }
});

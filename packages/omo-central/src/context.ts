import {ExecutionParams} from "subscriptions-transport-ws";
import {Request} from "express";
import {verifyUcan} from "omo-ucan/dist";
import {serverDid} from "./consts";

export class Context {
    readonly isSubscription: boolean;

    readonly jwt?: string;
    readonly originHeaderValue?: string;

    private constructor(isSubscription: boolean, jwt?: string, originHeaderValue?: string) {
        this.isSubscription = isSubscription;
        this.jwt = jwt;
        this.originHeaderValue = originHeaderValue;
    }

    public static create(arg: { req?: Request, connection?: ExecutionParams }): Context {
        let isSubscription = false;
        let authorizationHeaderValue: string | undefined;
        let originHeaderValue: string | undefined;

        if (arg.req && !arg.connection) {
            // HTTP
            originHeaderValue = arg.req.headers.origin;
            authorizationHeaderValue = arg.req.headers.authorization;
        }

        if (!arg.req && arg.connection) {
            // WS
            isSubscription = true;
            originHeaderValue = arg.connection.context.origin;
            authorizationHeaderValue = arg.connection.context.authorization;
        }

        return new Context(isSubscription, authorizationHeaderValue, originHeaderValue);
    }

    async verifyJwt() {
        if (!this.jwt || this.jwt.trim() == "") {
            throw new Error("No jwt was supplied");
        }

        const verifyResult = await verifyUcan(this.jwt, serverDid);
        if (!verifyResult.isValid) {
            console.log(`Invalid ucan '${this.jwt}'.`);
            verifyResult.errors.forEach((message: string) => console.log("Verification problem: ", message));
            throw new Error(`Invalid ucan.`);
        }

        const fissionNameFromUcan = <Record<string, string>>verifyResult.decoded.payload.rsc;
        const fissionUsername = fissionNameFromUcan["username"];
        if (!fissionUsername || fissionUsername.trim() == "") {
            throw new Error("No fission username was included in the UCAN's 'rsc'-claim. The 'rsc' claim must contain an object with 'username' property.")
        }

        return fissionUsername;
    }
}
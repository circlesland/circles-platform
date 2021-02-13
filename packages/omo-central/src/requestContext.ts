import {Request} from "express";

export class RequestContext
{
    readonly origin:string;

    private constructor(origin:string)
    {
        this.origin = origin;
    }

    public static create(arg:{req?:Request}) : RequestContext
    {
        if (!arg.req) {
            throw new Error("Only queries and mutations are allowed.")
        }

        const originHeaderValue = arg.req.headers["origin"];
        //if (!originHeaderValue)
        //    throw new Error("The incoming request doesn't have an Origin-header.")

        return new RequestContext(<string>originHeaderValue);
    }
}

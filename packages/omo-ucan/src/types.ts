export type Resource =
    "*" | Record<string, string>

export type UcanHeader = {
    alg: string,
    typ: string,
    uav: string
}

export type UcanPayload = {
    aud: string,
    exp: number,
    fct: Array<any>,
    iss: string,
    nbf: number,
    prf: string | undefined,
    ptc: string | undefined | null,
    rsc: Resource
}

export type Ucan = {
    header: UcanHeader,
    payload: UcanPayload,
    signature: string
}

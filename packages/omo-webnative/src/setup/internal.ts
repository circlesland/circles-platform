export type Endpoints = {
  api: string
  lobby: string
  user: string
}


/**
 * @internal
 */
export const setup : {
  debug: boolean
  externalLogger?:(...args: any[]) => void
  additionalDnsLinkUpdater?:(jwt:string, cid:string) => Promise<void>
  additionalDnsLinkResolver?:(fissionUsername:string) => Promise<string>
  endpoints: {
    api: string
    lobby: string
    user: string
  }
} = {
  debug: false,
  endpoints: {
    api: "https://runfission.com",
    lobby: "https://auth.fission.codes",
    user: "fission.name"
  }
}

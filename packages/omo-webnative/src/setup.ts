import { Endpoints, setup as internalSetup } from './setup/internal'

type UnknownObject =
  { [key: string]: unknown }


/**
 * Toggle debug mode.
 *
 * Only adds a few `console.log`s at this moment.
 */
export function configure({ enableDebugMode, externalLogger, additionalDnsLinkUpdater, additionalDnsLinkResolver }: {
  enableDebugMode: boolean
  externalLogger?:(...args: any[]) => void
  additionalDnsLinkUpdater?:(jwt:string, cid:string) => Promise<void>
  additionalDnsLinkResolver?:(fissionUsername:string) => Promise<string>
}): boolean {
  internalSetup.debug = enableDebugMode
  internalSetup.externalLogger = externalLogger;
  internalSetup.additionalDnsLinkUpdater = additionalDnsLinkUpdater;
  internalSetup.additionalDnsLinkResolver = additionalDnsLinkResolver;
  return internalSetup.debug
}


/**
 * Override endpoints.
 *
 * You can override each of these,
 * no need to provide them all here.
 *
 * `api` Location of the Fission API
 *       (default `https://runfission.com`)
 * `lobby` Location of the authentication lobby.
 *         (default `https://auth.fission.codes`)
 * `user`  User's domain to use, will be prefixed by username.
 *         (default `fission.name`)
 */
export function endpoints(e: Partial<Endpoints>): Endpoints {
  internalSetup.endpoints = { ...internalSetup.endpoints, ...e }
  return { ...internalSetup.endpoints }
}

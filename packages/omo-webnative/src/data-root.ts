import * as check from './fs/types/check'
import * as debug from './common/debug'
import * as did from './did'
import * as dns from './dns'
import * as ucan from './ucan'
import * as ipfs from './ipfs'
import { CID } from './ipfs'
import { Maybe, api } from './common'
import { setup } from './setup/internal'


// Controller for data-root-update fetches
let fetchController: Maybe<AbortController> = null

/**
 * CID representing an empty string. We use to to speed up DNS propagation
 * However, we treat that as a null value in the code
 */
const EMPTY_CID = 'Qmc5m94Gu7z62RC8waSKkZUrCCBJPyHbkpmGzEePxy2oXJ'

/**
 * Get the CID of a user's data root.
 *
 * First check Fission server, then check DNS
 *
 * @param username The username of the user that we want to get the data root of.
 */
export async function lookup(
    username: string
): Promise<CID | null> {
  const maybeRoot = await lookupOnFisson(username)
  if(maybeRoot === EMPTY_CID) return null
  if(maybeRoot !== null) return maybeRoot

  try {
    const cid = await dns.lookupDnsLink(username + '.files.' + setup.endpoints.user)
    return cid === EMPTY_CID ? null : cid
  } catch(err) {
    console.error(err)
    throw new Error('Could not locate user root in dns')
  }
}

/**
 * Get the CID of a user's data root from the Fission server.
 *
 * @param username The username of the user that we want to get the data root of.
 */
export async function lookupOnFisson(
    username: string
): Promise<CID | null> {
  const logger = debug.newLogger("lookupOnFisson()");
  if (setup.additionalDnsLinkResolver)
  {
    try
    {
      logger.log("A custom 'additionalDnsLinkResolver' was provided. Calling it now for: ", username)
      await setup.additionalDnsLinkResolver(username)
    }
    catch (e)
    {
      logger.log("ERROR: The custom 'additionalDnsLinkResolver' failed to execute: ", e)
    }
  }
  try {
    const resp = await fetch(
        `${setup.endpoints.api}/user/data/${username}`,
        { cache: 'reload' } // don't use cache
    )
    const cid = await resp.json()
    if (!check.isCID(cid)) {
      throw new Error("Did not receive a CID")
    }
    return cid

  } catch(err) {
    logger.log('Could not locate user root on Fission server: ', err.toString())
    return null

  }
}

/**
 * Update a user's data root.
 *
 * @param cid The CID of the data root.
 * @param proof The proof to use in the UCAN sent to the API.
 */
export async function update(
    cid: CID | string,
    proof: string
): Promise<void> {
  const logger = debug.newLogger(`DataRoot.update(cid: ${cid.toString()})`);
  logger.log("begin");
  const apiEndpoint = setup.endpoints.api

  // Debug
  logger.log("🚀 Updating your DNSLink:", cid)

  // Cancel previous updates
  if (fetchController) fetchController.abort()
  fetchController = new AbortController()
  const signal = fetchController.signal

  const jwt = await ucan.build({
    audience: await api.did(),
    issuer: await did.ucan(),
    potency: "APPEND",
    proof,

    // TODO: Waiting on API change.
    //       Should be `username.fission.name/*`
    resource: ucan.decode(proof).payload.rsc
  });

  // Make API call
  if (setup.additionalDnsLinkUpdater)
  {
    try
    {
      logger.log("A custom 'additionalDnsLinkUpdater' was provided. Calling it now for: ", cid)
      await setup.additionalDnsLinkUpdater(jwt, cid)
    }
    catch (e)
    {
      logger.log("ERROR: The custom 'additionalDnsLinkUpdater' failed to execute: ", e)
    }
  }

  await fetchWithRetry(`${apiEndpoint}/user/data/${cid}`, {
    headers: async () => {

      return { 'authorization': `Bearer ${jwt}` }
    },
    retries: 100,
    retryDelay: 5000,
    retryOn: [ 502, 503, 504 ],

  }, {
    method: 'PATCH',
    signal

  }).then((response: Response) => {
    if (response.status < 300) logger.log("🪴 DNSLink updated:", cid)
    else logger.log("🔥 Failed to update DNSLink for:", cid)

  }).catch(err => {
    if (signal.aborted) {
      logger.log("⛄️ Cancelling DNSLink update for:", cid)
    } else {
      logger.log("🔥 Failed to update DNSLink for:", cid)
      console.error(err)
    }

  })
}



// ㊙️


type RetryOptions = {
  headers: () => Promise<{ [_: string]: string }>
  retries: number
  retryDelay: number
  retryOn: Array<number>
}


async function fetchWithRetry(
    url: string,
    retryOptions: RetryOptions,
    fetchOptions: RequestInit,
    retry = 0
): Promise<Response> {
  const headers = await retryOptions.headers()
  const response = await fetch(url, {
    ...fetchOptions,
    headers: { ...fetchOptions.headers, ...headers }
  })

  if (retryOptions.retryOn.includes(response.status)) {
    if (retry < retryOptions.retries) {
      return await new Promise((resolve, reject) => setTimeout(
          () => fetchWithRetry(url, retryOptions, fetchOptions, retry + 1).then(resolve, reject),
          retryOptions.retryDelay
      ))
    } else {
      throw new Error("Too many retries for fetch")
    }
  }

  return response
}

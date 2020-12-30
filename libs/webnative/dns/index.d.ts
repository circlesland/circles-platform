/**
 * Lookup a DNS TXT record.
 *
 * Race lookups to Google & Cloudflare, return the first to finish
 *
 * @param domain The domain to get the TXT record from.
 * @returns Contents of the TXT record.
 */
export declare function lookupTxtRecord(domain: string): Promise<string | null>;
/**
 * Lookup DNS TXT record using Google DNS-over-HTTPS
 *
 * @param domain The domain to get the TXT record from.
 * @returns Contents of the TXT record.
 */
export declare function googleLookup(domain: string): Promise<string | null>;
/**
 * Lookup DNS TXT record using Cloudflare DNS-over-HTTPS
 *
 * @param domain The domain to get the TXT record from.
 * @returns Contents of the TXT record.
 */
export declare function cloudflareLookup(domain: string): Promise<string | null>;
/**
 * Lookup a DNS TXT record.
 *
 * If there are multiple records, they will be joined together.
 * Records are sorted by a decimal prefix before they are joined together.
 * Prefixes have a format of `001;` → `999;`
 *
 * @param url The DNS-over-HTTPS endpoint to hit.
 * @returns Contents of the TXT record.
 */
export declare function dnsOverHttps(url: string): Promise<string | null>;
/**
 * Lookup a DNSLink.
 *
 * @param domain The domain to get the DNSLink from.
 * @returns Contents of the DNSLink with the "ipfs/" prefix removed.
 */
export declare function lookupDnsLink(domain: string): Promise<string | null>;

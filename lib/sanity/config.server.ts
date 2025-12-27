import "server-only";
import { assertSanityPublic } from "./config.public";

/**
 * Sanity Server Configuration (SERVER-ONLY)
 * Contains write tokens - must never reach client bundle
 * 
 * Lazy evaluation: Only resolves config when called, not at import time
 */

export function getSanityServerConfig() {
  const pub = assertSanityPublic();
  
  const writeToken = process.env.SANITY_TOKEN || process.env.SANITY_WRITE_TOKEN;
  const readToken = process.env.SANITY_READ_TOKEN || process.env.SANITY_TOKEN;

  return {
    ...pub,
    readToken,
    writeToken,
  } as const;
}

/**
 * Validates server config including tokens
 */
export function assertServerConfig() {
  const config = getSanityServerConfig();
  if (!config.writeToken) {
    throw new Error(
      "Missing Sanity write token. " +
      "Set SANITY_TOKEN in .env.local"
    );
  }
  return config;
}


// src/common/utils/token-blacklist.ts

const revokedTokens = new Set<string>();

export function addRevokedToken(token: string) {
  revokedTokens.add(token);
}

export function isTokenRevoked(token: string): boolean {
  return revokedTokens.has(token);
}

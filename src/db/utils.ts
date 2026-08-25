import * as Crypto from 'expo-crypto';

export function createId(): string {
  return Crypto.randomUUID();
}

export function nowIso(now: Date = new Date()): string {
  return now.toISOString();
}

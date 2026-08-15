import { createHash } from "node:crypto";
import { and, eq, gt, lt } from "drizzle-orm";
import { listenerPresence } from "../drizzle/schema";
import { getDb } from "./db";
import { ENV } from "./_core/env";
import { normalizeTrustedCountryHeader } from "./_core/httpPolicy";

export const PRESENCE_HEARTBEAT_MS = 25_000;
export const PRESENCE_TTL_MS = 90_000;

export type PresenceSnapshot = {
  available: boolean;
  count: number | null;
  countries: string[];
};

type HeaderMap = Record<string, string | string[] | undefined>;

export function hashAnonymousSession(sessionToken: string) {
  return createHash("sha256").update(`sangeet-ghar-presence:${sessionToken}`).digest("hex");
}

export function trustedCountryFromHeaders(
  headers: HeaderMap,
  trustedHeader = ENV.trustedCountryHeader,
) {
  const headerName = normalizeTrustedCountryHeader(trustedHeader);
  if (!headerName) return null;

  const candidate = headers[headerName] as string | undefined;
  const code = candidate?.trim().toUpperCase();
  return code && /^[A-Z]{2}$/.test(code) && code !== "XX" && code !== "T1" ? code : null;
}

function cutoffDate(now = Date.now()) {
  return new Date(now - PRESENCE_TTL_MS);
}

async function cleanExpired(now = Date.now()) {
  const db = await getDb();
  if (!db) return null;
  await db.delete(listenerPresence).where(lt(listenerPresence.lastSeen, cutoffDate(now)));
  return db;
}

export async function getPresenceSnapshot(now = Date.now()): Promise<PresenceSnapshot> {
  const db = await cleanExpired(now);
  if (!db) return { available: false, count: null, countries: [] };

  const activeRows = await db.select({ countryCode: listenerPresence.countryCode })
    .from(listenerPresence)
    .where(and(eq(listenerPresence.isListening, true), gt(listenerPresence.lastSeen, cutoffDate(now))));

  const countryCounts = new Map<string, number>();
  activeRows.forEach(row => {
    if (row.countryCode) countryCounts.set(row.countryCode, (countryCounts.get(row.countryCode) ?? 0) + 1);
  });
  const countries = activeRows.length >= 3
    ? Array.from(countryCounts.entries())
      .filter(([, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 5)
      .map(([country]) => country)
    : [];

  return {
    available: true,
    count: activeRows.length,
    countries,
  };
}

export async function heartbeatPresence(input: {
  sessionKey: string;
  countryCode: string | null;
  listening: boolean;
}) {
  const db = await getDb();
  if (!db) return { available: false, count: null, countries: [] } satisfies PresenceSnapshot;

  const now = new Date();
  await db.insert(listenerPresence).values({
    sessionKey: input.sessionKey,
    countryCode: input.countryCode,
    isListening: input.listening,
    lastSeen: now,
  }).onDuplicateKeyUpdate({
    set: {
      countryCode: input.countryCode,
      isListening: input.listening,
      lastSeen: now,
    },
  });
  return getPresenceSnapshot(now.getTime());
}

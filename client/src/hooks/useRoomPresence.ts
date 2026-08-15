import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

const ROOM_TOKEN_KEY = "sangeet-ghar-room-token";
const HEARTBEAT_MS = 25_000;

function getRoomToken() {
  const existing = window.localStorage.getItem(ROOM_TOKEN_KEY);
  if (existing && /^[0-9a-f-]{36}$/i.test(existing)) return existing;
  const created = crypto.randomUUID();
  window.localStorage.setItem(ROOM_TOKEN_KEY, created);
  return created;
}

export function countryName(code: string) {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

export function useRoomPresence(isListening: boolean) {
  const [session] = useState(getRoomToken);
  const [wasListening, setWasListening] = useState(false);
  const utils = trpc.useUtils();
  const snapshotQuery = trpc.presence.snapshot.useQuery(undefined, {
    refetchInterval: 30_000,
    staleTime: 15_000,
    retry: 1,
  });
  const heartbeat = trpc.presence.heartbeat.useMutation({
    onSuccess: data => utils.presence.snapshot.setData(undefined, data),
  });
  const sendPresenceHeartbeat = heartbeat.mutate;

  useEffect(() => {
    if (isListening) setWasListening(true);
  }, [isListening]);

  useEffect(() => {
    if (!isListening && !wasListening) return;
    const sendHeartbeat = () => sendPresenceHeartbeat({ session, listening: isListening });
    sendHeartbeat();
    if (!isListening) return;
    const timer = window.setInterval(sendHeartbeat, HEARTBEAT_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") sendHeartbeat();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [isListening, sendPresenceHeartbeat, session, wasListening]);

  const snapshot = snapshotQuery.data;

  return {
    snapshot,
    presenceUnavailable: snapshotQuery.isError || snapshot?.available === false,
  };
}

export type LampMode = "light" | "lamp-lit";

export const INITIAL_LAMP_MODE: LampMode = "light";

export function toggleLampMode(mode: LampMode): LampMode {
  return mode === "light" ? "lamp-lit" : "light";
}

export function isLampLit(mode: LampMode) {
  return mode === "lamp-lit";
}

import { describe, expect, it } from "vitest";
import { INITIAL_LAMP_MODE, isLampLit, toggleLampMode } from "../client/src/lib/lampMode";

describe("lamp mode", () => {
  it("starts with the room in light mode", () => {
    expect(INITIAL_LAMP_MODE).toBe("light");
    expect(isLampLit(INITIAL_LAMP_MODE)).toBe(false);
  });

  it("switches deterministically between light and lamp-lit modes", () => {
    const lampLit = toggleLampMode(INITIAL_LAMP_MODE);
    expect(lampLit).toBe("lamp-lit");
    expect(isLampLit(lampLit)).toBe(true);
    expect(toggleLampMode(lampLit)).toBe("light");
  });
});

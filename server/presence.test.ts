import { describe, expect, it } from "vitest";
import { hashAnonymousSession, trustedCountryFromHeaders } from "./presence";

describe("anonymous presence helpers", () => {
  it("hashes an anonymous room token deterministically without returning the token", () => {
    const token = "726d49bc-4a4e-46c7-8d32-3e86977136ab";
    const hash = hashAnonymousSession(token);
    expect(hash).toHaveLength(64);
    expect(hash).not.toContain(token);
    expect(hash).toBe(hashAnonymousSession(token));
  });

  it("accepts only valid trusted two-letter country headers", () => {
    expect(trustedCountryFromHeaders({ "cf-ipcountry": "np" }, "cf-ipcountry")).toBe("NP");
    expect(trustedCountryFromHeaders({ "cf-ipcountry": "XX" }, "cf-ipcountry")).toBeNull();
    expect(trustedCountryFromHeaders({ "cf-ipcountry": "Nepal" }, "cf-ipcountry")).toBeNull();
    expect(trustedCountryFromHeaders({}, "cf-ipcountry")).toBeNull();
    expect(trustedCountryFromHeaders({ "cf-ipcountry": "NP" })).toBeNull();
  });
});

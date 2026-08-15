import { describe, expect, it } from "vitest";
import {
  isAllowedBrowserOrigin,
  normalizeTrustedCountryHeader,
  parseAllowedOrigins,
} from "./_core/httpPolicy";

describe("production HTTP policy", () => {
  it("restricts browser origins to the configured allowlist", () => {
    const allowedOrigins = parseAllowedOrigins(
      "https://sangeet.pravingyawali.com.np, http://localhost:3000",
    );
    expect(isAllowedBrowserOrigin("https://sangeet.pravingyawali.com.np", allowedOrigins)).toBe(true);
    expect(isAllowedBrowserOrigin("https://untrusted.example", allowedOrigins)).toBe(false);
    expect(isAllowedBrowserOrigin(undefined, allowedOrigins)).toBe(false);
  });

  it("requires an explicit supported country header from a trusted proxy", () => {
    expect(normalizeTrustedCountryHeader("CF-IPCountry")).toBe("cf-ipcountry");
    expect(normalizeTrustedCountryHeader("x-country-code")).toBe("x-country-code");
    expect(normalizeTrustedCountryHeader("x-forwarded-for")).toBeNull();
    expect(normalizeTrustedCountryHeader()).toBeNull();
  });
});

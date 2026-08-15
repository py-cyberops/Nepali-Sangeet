import { describe, expect, it } from "vitest";
import { buildTrpcUrl, shouldIncludeApiCredentials } from "@/lib/apiUrl";

describe("split-deployment API URL", () => {
  it("keeps the existing relative endpoint when no public API host is configured", () => {
    expect(buildTrpcUrl()).toBe("/api/trpc");
    expect(shouldIncludeApiCredentials()).toBe(true);
  });

  it("normalizes a public API origin without leaking development cookie behavior", () => {
    expect(buildTrpcUrl("https://api.sangeet.pravingyawali.com.np/")).toBe(
      "https://api.sangeet.pravingyawali.com.np/api/trpc",
    );
    expect(shouldIncludeApiCredentials("https://api.sangeet.pravingyawali.com.np")).toBe(false);
  });
});

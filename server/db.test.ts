import { describe, expect, it } from "vitest";
import { tidbPoolOptions } from "./db";

describe("tidbPoolOptions", () => {
  it("creates a TLS-safe mysql2 pool configuration from an encoded TiDB URL", () => {
    const options = tidbPoolOptions(
      "mysql://room.root:pa%40ss%3Aword@gateway.example.tidbcloud.com:4000/sangeet_ghar?ssl=%7B%22rejectUnauthorized%22%3Atrue%7D",
    );

    expect(options).toMatchObject({
      host: "gateway.example.tidbcloud.com",
      port: 4000,
      user: "room.root",
      password: "pa@ss:word",
      database: "sangeet_ghar",
      ssl: { minVersion: "TLSv1.2", rejectUnauthorized: true },
      connectionLimit: 5,
      enableKeepAlive: true,
    });
  });

  it("rejects a URL without a database name", () => {
    expect(() => tidbPoolOptions("mysql://room.root:password@gateway.example.tidbcloud.com:4000/")).toThrow(
      "DATABASE_URL must include host, user, and database",
    );
  });
});

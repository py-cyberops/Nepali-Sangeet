import { boolean, index, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Opaque, server-hashed browser session records for the shared listening room.
 * No identity, raw IP address, or exact location is stored.
 */
export const listenerPresence = mysqlTable("listener_presence", {
  sessionKey: varchar("sessionKey", { length: 64 }).primaryKey(),
  countryCode: varchar("countryCode", { length: 2 }),
  isListening: boolean("isListening").notNull().default(false),
  lastSeen: timestamp("lastSeen").notNull(),
}, table => ({
  lastSeenIndex: index("listener_presence_last_seen_idx").on(table.lastSeen),
  countryIndex: index("listener_presence_country_idx").on(table.countryCode),
}));

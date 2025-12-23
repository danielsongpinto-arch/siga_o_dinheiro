import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

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
 * Bookmarks table for storing user highlights/annotations from articles.
 * Synced across devices when user is authenticated.
 */
export const bookmarks = mysqlTable("bookmarks", {
  id: varchar("id", { length: 64 }).primaryKey(), // UUID gerado no cliente
  userId: int("userId").notNull(), // Foreign key para users.id
  articleId: varchar("articleId", { length: 64 }).notNull(),
  articleTitle: text("articleTitle").notNull(),
  partTitle: text("partTitle").notNull(),
  excerpt: text("excerpt").notNull(),
  note: text("note"),
  tags: text("tags"), // JSON array de tag IDs
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Bookmark = typeof bookmarks.$inferSelect;
export type InsertBookmark = typeof bookmarks.$inferInsert;

/**
 * User settings table for storing user preferences.
 * Synced across devices when user is authenticated.
 */
export const userSettings = mysqlTable("userSettings", {
  userId: int("userId").primaryKey(), // Foreign key para users.id (1 registro por usuário)
  themePreference: varchar("themePreference", { length: 16 }), // "light" | "dark" | "auto"
  fontSize: varchar("fontSize", { length: 8 }), // "xs" | "sm" | "md" | "lg" | "xl"
  lineSpacing: varchar("lineSpacing", { length: 16 }), // "compact" | "normal" | "expanded"
  readingRemindersEnabled: int("readingRemindersEnabled"), // 0 = false, 1 = true
  readingReminderTime: varchar("readingReminderTime", { length: 8 }), // "HH:MM"
  readingReminderDays: text("readingReminderDays"), // JSON array [1,2,3,4,5]
  readingGoalType: varchar("readingGoalType", { length: 16 }), // "weekly" | "monthly"
  readingGoalTarget: int("readingGoalTarget"),
  nightModeEnabled: int("nightModeEnabled"), // 0 = false, 1 = true
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = typeof userSettings.$inferInsert;

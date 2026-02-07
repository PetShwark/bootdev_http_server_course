import { sql } from 'drizzle-orm';
import { pgTable, timestamp, varchar, uuid } from "drizzle-orm/pg-core";
import { boolean } from "drizzle-orm/pg-core/columns/boolean";
export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    email: varchar("email", { length: 256 }).unique().notNull(),
    hashedPassword: varchar("hashed_password", { length: 256 }),
    isChirpyRed: boolean("is_chirpy_red").notNull().default(false),
});
export const chirps = pgTable("chirps", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    body: varchar("body", { length: 256 }).unique().notNull(),
    userId: uuid('user_id')
        .notNull()
        // Reference the 'id' column in the 'users' table
        .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
});
export const refresh_tokens = pgTable("refresh_tokens", {
    id: varchar("token", { length: 64 }).primaryKey(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    expiresAt: timestamp("expires_at")
        .notNull()
        .default(sql `now() + interval '60 day'`), // Default to 60 days from now
    revokedAt: timestamp("revoked_at"),
    userId: uuid('user_id')
        .notNull()
        // Reference the 'id' column in the 'users' table
        .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
});

import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: serial('id').primaryKey(),
  discordId: text('discord_id').notNull(),
  username: text('username').notNull(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => user.id),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

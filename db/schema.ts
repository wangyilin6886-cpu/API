import { pgTable, text, integer, bigint, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const apiKeys = pgTable('api_keys', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  // SHA-256 hash of the full ek-xxx key. The plaintext is shown to the user
  // only once at creation and never stored.
  keyHash: text('key_hash').notNull().unique(),
  // Display hint, e.g. "ek-a1b2...f9e0" — safe to show in the dashboard.
  keyHint: text('key_hint').notNull(),
  name: text('name').notNull().default('Default'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  revokedAt: timestamp('revoked_at'),
})

export const usageLogs = pgTable('usage_logs', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  keyId: text('key_id')
    .notNull()
    .references(() => apiKeys.id, { onDelete: 'cascade' }),
  model: text('model').notNull(),
  inputTokens: integer('input_tokens').notNull().default(0),
  outputTokens: integer('output_tokens').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

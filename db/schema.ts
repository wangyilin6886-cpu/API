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
  // Key shown to users, format: ek-xxxxxxxxxxxxxxxxxxxxx
  ourKey: text('our_key').notNull().unique(),
  // B's actual upstream key — store encrypted in production
  bKey: text('b_key').notNull(),
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

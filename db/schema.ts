import { pgTable, text, integer, bigint, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  // Account balance in US cents. New users get a small free trial credit.
  balanceCents: integer('balance_cents').notNull().default(500),
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
  // Model ids or family patterns this key may call, e.g.
  // ['gemini-*', 'claude-opus-4-8']. NULL or empty means unrestricted.
  // Fixed at creation — to change the scope, revoke and issue a new key.
  allowedModels: text('allowed_models').array(),
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
  // Amount charged for this request, in US cents.
  costCents: integer('cost_cents').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Top-ups and bonuses (positive amounts). Per-request deductions are NOT stored
// here — they live in usage_logs.cost_cents.
export const transactions = pgTable('transactions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'topup' | 'bonus'
  amountCents: integer('amount_cents').notNull(),
  // Polar order id, for idempotency (unique when present).
  polarOrderId: text('polar_order_id').unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

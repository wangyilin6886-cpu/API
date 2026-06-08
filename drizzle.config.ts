import { readFileSync } from 'fs'
import { defineConfig } from 'drizzle-kit'

// Load .env.local for local development (drizzle-kit doesn't auto-read it)
try {
  const lines = readFileSync('.env.local', 'utf8').split('\n')
  for (const line of lines) {
    const [k, ...rest] = line.split('=')
    if (k && rest.length) process.env[k.trim()] = rest.join('=').trim()
  }
} catch {
  // .env.local doesn't exist — rely on environment variables set externally
}

export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})

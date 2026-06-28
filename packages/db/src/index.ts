import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "@invoicely/utilities";
import postgres from "postgres";
import * as schema from "./schema";

// Standard Postgres connection (works with Supabase's pooler, Neon's direct
// connection, RDS, etc.). `prepare: false` is required when using a
// transaction-mode connection pooler such as Supabase's port 6543 pooler.
const sql = postgres(env.DATABASE_URL, { prepare: false });

const db = drizzle(sql, { schema });

export { db, sql, schema };

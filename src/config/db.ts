import { Pool, type PoolConfig } from "pg";
import { ENV } from "../validations/env.validation.js"
import type { dbQuery } from "../types/dbQuery.js";

const pool: Pool = new Pool({
    connectionString: ENV.DATABASE_URL,
    ssl: ENV.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
} as PoolConfig)

export const query: dbQuery = (queryText, params) => pool.query(queryText, params);
import { Pool, type PoolConfig } from "pg";
import { ENV } from "../validations/env.validation"
import type { dbQuery } from "../types/dbQuery";

/*
-------------------------------------------------------
                    POOL CREATION
-------------------------------------------------------
*/

const pool: Pool = new Pool({
    connectionString: ENV.DATABASE_URL, /* Connection url of database */
    applicatiot_name: "server-society-system-management-db", /* For easy navigation in logs */
    max: 20, /* Connections limit in pool*/
    keepAlive: true,
    statement_timeout: 10000, /* kills query execution after 10 seconds */
    ssl: ENV.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
} as PoolConfig)

/*Connection successful*/
pool.on("connect", () => console.log("Database Connection Successful"));

/*Error in connecitng database*/
pool.on("error", (err: Error) => {
    console.error("Error in connecting db " + err.message);
    process.exit(-1);
});

/*Creating query common method for using rather importing repetetively */
export const query: dbQuery = (queryText, params) => pool.query(queryText, params);

export default pool;
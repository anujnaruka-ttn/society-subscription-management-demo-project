import type { QueryResult, QueryResultRow } from "pg";

export type dbQuery = <T extends QueryResultRow>(
    text: string,
    params?: any[]
) => Promise<QueryResult<T>>;
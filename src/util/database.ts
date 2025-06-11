import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres';
import {db_url} from "../../config.json"

let db: PostgresJsDatabase | null = null;

async function main() {
    const client = postgres(db_url, {"prepare":false});
    const database = drizzle(client)
    db = database;
}

export async function getDb(): Promise<PostgresJsDatabase> {
    if (!db) {
        await main();
    }
    if (!db) {
        throw new Error("Database not initialized");
    }
    return db;
}
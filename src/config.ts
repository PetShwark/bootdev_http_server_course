import { NotFoundError } from "./middleware/mw_error_defs.js";
import type { MigrationConfig } from "drizzle-orm/migrator";

export const migrationConfig: MigrationConfig = {
    migrationsFolder: "./src/lib/db/migrations",
};

export type DBConfig = {
    dbURL: string;
    migrationConfig: MigrationConfig;
}

export type APIConfig = {
    fileserverHits: number;
};

export type ProjConfig = {
    apiConfig: APIConfig;
    dbConfig: DBConfig;
}

function envOrThrow(key: string): string {
    try {
        return process.env[key]!;
    } catch (err) {
        throw new NotFoundError(`${key} environment variable not found`);
    }
}

process.loadEnvFile();

export const config: ProjConfig = {
    apiConfig: { fileserverHits: 0 },
    dbConfig: { dbURL: envOrThrow('DB_URL'), migrationConfig: migrationConfig }
};
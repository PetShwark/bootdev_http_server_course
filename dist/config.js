import { NotFoundError } from "./middleware/mw_error_defs.js";
export const migrationConfig = {
    migrationsFolder: "./src/lib/db/migrations",
};
function envOrThrow(key) {
    try {
        return process.env[key];
    }
    catch (err) {
        throw new NotFoundError(`${key} environment variable not found`);
    }
}
process.loadEnvFile();
export const config = {
    apiConfig: { fileserverHits: 0 },
    dbConfig: { dbURL: envOrThrow('DB_URL'), migrationConfig: migrationConfig }
};
